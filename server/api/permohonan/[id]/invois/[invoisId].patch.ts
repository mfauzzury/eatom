import { and, eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { invois } from '../../../../db/schema'
import { requireRole, insertAuditTrail } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  const invoisId = Number(getRouterParam(event, 'invoisId'))
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { action, rujukanBayar, catatanKewangan } = body

  const inv = await db.query.invois.findFirst({
    where: (i, { and, eq }) => and(eq(i.id, invoisId), eq(i.permohonanId, id))
  })
  if (!inv) {
    throw createError({ statusCode: 404, statusMessage: 'Invois tidak dijumpai' })
  }

  if (action === 'bayar') {
    // Simulate payment (PL or ADMIN)
    const session = await requireRole(event, ['PL', 'ADMIN'])
    if (inv.status !== 'belum_bayar') {
      throw createError({ statusCode: 400, statusMessage: 'Invois ini sudah dibayar atau disahkan.' })
    }
    await db.update(invois).set({
      status: 'telah_bayar',
      tarikhBayar: new Date(),
      rujukanBayar: rujukanBayar || `PAY-${Date.now()}`,
      updatedAt: new Date()
    }).where(eq(invois.id, invoisId))

    await insertAuditTrail({
      userId: session.user.id,
      action: 'BAYAR_INVOIS',
      resourceType: 'invois',
      resourceId: String(invoisId),
      oldValue: { status: inv.status },
      newValue: { status: 'telah_bayar', rujukanBayar },
      ipAddress: getRequestIP(event),
      userAgent: getRequestHeader(event, 'user-agent')
    })

    return { id: invoisId, status: 'telah_bayar' }
  }

  if (action === 'sahkan') {
    // Verify payment (PS/KU/ADMIN)
    const session = await requireRole(event, ['PS', 'KU', 'ADMIN'])
    if (inv.status !== 'telah_bayar') {
      throw createError({ statusCode: 400, statusMessage: 'Invois mesti dibayar sebelum disahkan.' })
    }
    await db.update(invois).set({
      status: 'disahkan',
      disahkanOleh: session.user.id,
      tarikhSah: new Date(),
      catatanKewangan: catatanKewangan || null,
      updatedAt: new Date()
    }).where(eq(invois.id, invoisId))

    await insertAuditTrail({
      userId: session.user.id,
      action: 'SAHKAN_INVOIS',
      resourceType: 'invois',
      resourceId: String(invoisId),
      oldValue: { status: inv.status },
      newValue: { status: 'disahkan' },
      ipAddress: getRequestIP(event),
      userAgent: getRequestHeader(event, 'user-agent')
    })

    return { id: invoisId, status: 'disahkan' }
  }

  if (action === 'batal') {
    const session = await requireRole(event, ['PS', 'KU', 'ADMIN'])
    if (inv.status === 'disahkan') {
      throw createError({ statusCode: 400, statusMessage: 'Invois yang telah disahkan tidak boleh dibatalkan.' })
    }
    await db.update(invois).set({
      status: 'batal',
      catatanKewangan: catatanKewangan || null,
      updatedAt: new Date()
    }).where(eq(invois.id, invoisId))

    await insertAuditTrail({
      userId: session.user.id,
      action: 'BATAL_INVOIS',
      resourceType: 'invois',
      resourceId: String(invoisId),
      oldValue: { status: inv.status },
      newValue: { status: 'batal' },
      ipAddress: getRequestIP(event),
      userAgent: getRequestHeader(event, 'user-agent')
    })

    return { id: invoisId, status: 'batal' }
  }

  throw createError({ statusCode: 400, statusMessage: 'Tindakan tidak sah. Gunakan: bayar, sahkan, atau batal.' })
})
