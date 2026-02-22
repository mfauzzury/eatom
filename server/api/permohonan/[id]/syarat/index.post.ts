import { db } from '../../../../db'
import { syaratLesen, permohonanLesen } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PS', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { kodSyarat, penerangan, kategori } = body

  if (!penerangan?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Penerangan syarat diperlukan.' })
  }

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }
  if (existing.status !== 'semakan_PS') {
    throw createError({ statusCode: 400, statusMessage: 'Syarat lesen hanya boleh ditambah semasa semakan PS.' })
  }

  const [inserted] = await db.insert(syaratLesen).values({
    permohonanId: id,
    kodSyarat: kodSyarat || null,
    penerangan,
    kategori: kategori || null,
    addedBy: session.user.id
  }).returning()

  await insertAuditTrail({
    userId: session.user.id,
    action: 'ADD_SYARAT_LESEN',
    resourceType: 'syarat_lesen',
    resourceId: String(inserted.id),
    newValue: { kodSyarat, penerangan, kategori, permohonanId: id },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return inserted
})
