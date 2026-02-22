import { eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { permohonanLesen } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['KU', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { kategoriKawalan, catatanKategori } = body

  if (!kategoriKawalan || !['A', 'B', 'C', 'D', 'E'].includes(kategoriKawalan)) {
    throw createError({ statusCode: 400, statusMessage: 'Kategori kawalan tidak sah. Pilih A, B, C, D, atau E.' })
  }

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }
  if (existing.status !== 'semakan_KU') {
    throw createError({ statusCode: 400, statusMessage: 'Kategori kawalan hanya boleh ditetapkan semasa semakan KU.' })
  }

  await db.update(permohonanLesen).set({
    kategoriKawalan,
    catatanKategori: catatanKategori || null,
    updatedAt: new Date()
  }).where(eq(permohonanLesen.id, id))

  await insertAuditTrail({
    userId: session.user.id,
    action: 'SET_KATEGORI_KAWALAN',
    resourceType: 'permohonan_lesen',
    resourceId: String(id),
    oldValue: { kategoriKawalan: existing.kategoriKawalan, catatanKategori: existing.catatanKategori },
    newValue: { kategoriKawalan, catatanKategori },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return { id, kategoriKawalan, catatanKategori }
})
