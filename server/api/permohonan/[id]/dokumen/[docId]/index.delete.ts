import { and, eq } from 'drizzle-orm'
import { unlink } from 'node:fs/promises'
import { db } from '../../../../../db'
import { dokumenPermohonan, permohonanLesen } from '../../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PL', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const docId = Number(getRouterParam(event, 'docId'))

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }
  if (!['draf', 'dikemukakan'].includes(existing.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Dokumen hanya boleh dipadam untuk permohonan berstatus draf atau dikemukakan.' })
  }

  const doc = await db.query.dokumenPermohonan.findFirst({
    where: (d, { and, eq }) => and(eq(d.id, docId), eq(d.permohonanId, id))
  })
  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak dijumpai' })
  }

  // Delete file from disk
  try {
    await unlink(doc.storagePath)
  } catch {
    // File may already be gone, continue with DB cleanup
  }

  await db.delete(dokumenPermohonan).where(
    and(eq(dokumenPermohonan.id, docId), eq(dokumenPermohonan.permohonanId, id))
  )

  await insertAuditTrail({
    userId: session.user.id,
    action: 'DELETE_DOKUMEN',
    resourceType: 'dokumen_permohonan',
    resourceId: String(docId),
    oldValue: { namaFail: doc.namaFail, jenisDoc: doc.jenisDoc },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return { success: true }
})
