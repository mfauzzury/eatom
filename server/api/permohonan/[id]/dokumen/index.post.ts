import { eq } from 'drizzle-orm'
import { join, extname } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { db } from '../../../../db'
import { dokumenPermohonan, permohonanLesen } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

const UPLOAD_DIR = './uploads'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PL', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }
  if (!['draf', 'dikemukakan'].includes(existing.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Dokumen hanya boleh dimuat naik untuk permohonan berstatus draf atau dikemukakan.' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tiada fail dimuat naik.' })
  }

  const filePart = formData.find(p => p.name === 'file')
  const jenisDocPart = formData.find(p => p.name === 'jenisDoc')

  if (!filePart || !filePart.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Fail diperlukan.' })
  }

  const jenisDoc = jenisDocPart?.data?.toString() ?? 'lain_lain'
  const validJenis = ['ssm', 'lesen_sedia_ada', 'surat_sokongan', 'pelan_tapak', 'lain_lain']
  if (!validJenis.includes(jenisDoc)) {
    throw createError({ statusCode: 400, statusMessage: 'Jenis dokumen tidak sah.' })
  }

  if (filePart.data.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Saiz fail melebihi had 10MB.' })
  }

  const mimeType = filePart.type ?? 'application/octet-stream'
  if (!ALLOWED_MIME.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: `Jenis fail tidak dibenarkan: ${mimeType}` })
  }

  // Sanitize filename and create unique storage name
  const ext = extname(filePart.filename)
  const safeName = filePart.filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 100)
  const storageName = `${Date.now()}_${safeName}`
  const dir = join(UPLOAD_DIR, String(id))
  const storagePath = join(dir, storageName)

  await mkdir(dir, { recursive: true })
  await writeFile(storagePath, filePart.data)

  const [inserted] = await db.insert(dokumenPermohonan).values({
    permohonanId: id,
    namaFail: filePart.filename,
    jenisDoc: jenisDoc as 'ssm' | 'lesen_sedia_ada' | 'surat_sokongan' | 'pelan_tapak' | 'lain_lain',
    saizFail: filePart.data.length,
    mimeType,
    storagePath,
    uploadedBy: session.user.id
  }).returning()

  await insertAuditTrail({
    userId: session.user.id,
    action: 'UPLOAD_DOKUMEN',
    resourceType: 'dokumen_permohonan',
    resourceId: String(inserted.id),
    newValue: { namaFail: filePart.filename, jenisDoc, permohonanId: id },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return {
    id: inserted.id,
    namaFail: inserted.namaFail,
    jenisDoc: inserted.jenisDoc,
    saizFail: inserted.saizFail,
    mimeType: inserted.mimeType,
    createdAt: inserted.createdAt
  }
})
