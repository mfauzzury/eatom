import { requireAuth, insertAuditTrail } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { status: newStatus, catatan } = body

  await insertAuditTrail({
    userId: session.user.id,
    action: `STATUS_${(newStatus as string).toUpperCase()}`,
    resourceType: 'permohonan_lesen',
    resourceId: String(id),
    newValue: { status: newStatus, catatan },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { id, status: newStatus }
})
