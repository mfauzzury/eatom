import { eq, sql } from 'drizzle-orm'
import { db } from '../../../../db'
import { invois, permohonanLesen } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PS', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { jenisInvois, jumlah } = body

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }

  if (!['fee_permohonan', 'fee_lesen'].includes(jenisInvois)) {
    throw createError({ statusCode: 400, statusMessage: 'Jenis invois tidak sah.' })
  }
  if (!jumlah || jumlah <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Jumlah invois mesti lebih daripada 0.' })
  }

  // Generate unique invoice number
  const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(invois)
  const nextNum = (countResult?.count ?? 0) + 1
  const noInvois = `INV/2026/${String(nextNum).padStart(5, '0')}`

  const [inserted] = await db.insert(invois).values({
    noInvois,
    permohonanId: id,
    jenisInvois: jenisInvois as 'fee_permohonan' | 'fee_lesen',
    jumlah
  }).returning()

  await insertAuditTrail({
    userId: session.user.id,
    action: 'CREATE_INVOIS',
    resourceType: 'invois',
    resourceId: String(inserted.id),
    newValue: { noInvois, jenisInvois, jumlah, permohonanId: id },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return inserted
})
