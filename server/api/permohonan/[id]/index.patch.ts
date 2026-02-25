import { requireRole, insertAuditTrail } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PL', 'ADMIN'])
  const id = Number(getRouterParam(event, 'id'))
  await readBody(event)

  await insertAuditTrail({
    userId: session.user.id,
    action: 'UPDATE_DRAF',
    resourceType: 'permohonan_lesen',
    resourceId: String(id),
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { id, success: true }
})
