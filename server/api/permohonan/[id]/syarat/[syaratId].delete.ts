import { and, eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { syaratLesen, permohonanLesen } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PS', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  const syaratId = Number(getRouterParam(event, 'syaratId'))

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }
  if (existing.status !== 'semakan_PS') {
    throw createError({ statusCode: 400, statusMessage: 'Syarat lesen hanya boleh dipadam semasa semakan PS.' })
  }

  const syarat = await db.query.syaratLesen.findFirst({
    where: (s, { and, eq }) => and(eq(s.id, syaratId), eq(s.permohonanId, id))
  })
  if (!syarat) {
    throw createError({ statusCode: 404, statusMessage: 'Syarat lesen tidak dijumpai' })
  }

  await db.delete(syaratLesen).where(
    and(eq(syaratLesen.id, syaratId), eq(syaratLesen.permohonanId, id))
  )

  await insertAuditTrail({
    userId: session.user.id,
    action: 'DELETE_SYARAT_LESEN',
    resourceType: 'syarat_lesen',
    resourceId: String(syaratId),
    oldValue: { kodSyarat: syarat.kodSyarat, penerangan: syarat.penerangan },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  return { success: true }
})
