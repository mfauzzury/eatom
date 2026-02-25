import { permohonanList } from '../../data/dummy'
import { requireRole, insertAuditTrail } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PS', 'KU', 'ADMIN', 'PL'])
  const body = await readBody(event)
  const { id, action, comment, assigneeId } = body

  if (!id || !action) throw createError({ statusCode: 400, statusMessage: 'Missing id or action' })

  const row = permohonanList.find(p => p.id === Number(id))
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Permohonan not found' })

  const updated = { ...row }

  switch (action) {
    case 'claim': {
      if ((session.user as any).role === 'PS') {
        updated.assignedPSId = session.user.id
      } else if ((session.user as any).role === 'KU') {
        updated.assignedKUId = session.user.id
      } else {
        throw createError({ statusCode: 403, statusMessage: 'Role cannot claim' })
      }
      break
    }
    case 'approve_ps': {
      updated.status = 'lulus_PS' as any
      updated.catatanPS = comment ?? null
      break
    }
    case 'reject_ps': {
      updated.status = 'ditolak' as any
      updated.catatanPS = comment ?? null
      break
    }
    case 'approve_ku': {
      updated.status = 'diluluskan' as any
      updated.catatanKU = comment ?? null
      updated.approvedAt = new Date()
      break
    }
    case 'reject_ku': {
      updated.status = 'ditolak' as any
      updated.catatanKU = comment ?? null
      break
    }
    case 'assign_ku': {
      if (!assigneeId) throw createError({ statusCode: 400, statusMessage: 'assigneeId required' })
      updated.assignedKUId = assigneeId
      break
    }
    default:
      throw createError({ statusCode: 400, statusMessage: 'Unknown action' })
  }

  updated.updatedAt = new Date()

  await insertAuditTrail({
    userId: session.user.id,
    action: `ACTION_${action.toUpperCase()}`,
    resourceType: 'permohonan_lesen',
    resourceId: String(id),
    newValue: { action, status: updated.status },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { ok: true, data: updated }
})
