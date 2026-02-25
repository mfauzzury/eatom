import { auditTrailList, getUser } from '../../data/dummy'
import { requireRole } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'P', 'KP'])
  const query = getQuery(event)
  const limit = Number(query.limit ?? 50)

  return auditTrailList.slice(0, limit).map(a => {
    const u = a.userId ? getUser(a.userId) : null
    return {
      id: a.id,
      action: a.action,
      resourceType: a.resourceType,
      resourceId: a.resourceId,
      newValue: a.newValue,
      createdAt: a.createdAt,
      userName: u?.name ?? null,
      userEmail: u?.email ?? null,
      userRole: u?.role ?? null,
    }
  })
})
