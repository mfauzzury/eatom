import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['KU', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { kategoriKawalan, catatanKategori } = body

  if (!kategoriKawalan || !['A', 'B', 'C', 'D', 'E'].includes(kategoriKawalan)) {
    throw createError({ statusCode: 400, statusMessage: 'Kategori kawalan tidak sah. Pilih A, B, C, D, atau E.' })
  }

  await insertAuditTrail({
    userId: session.user.id,
    action: 'SET_KATEGORI_KAWALAN',
    resourceType: 'permohonan_lesen',
    resourceId: String(id),
    newValue: { kategoriKawalan, catatanKategori },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { id, kategoriKawalan, catatanKategori: catatanKategori || null }
})
