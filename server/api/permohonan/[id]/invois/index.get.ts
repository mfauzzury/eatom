import { eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { invois, permohonanLesen, user } from '../../../../db/schema'
import { requireAuth } from '../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const existing = await db.query.permohonanLesen.findFirst({
    where: (p, { eq }) => eq(p.id, id)
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }

  const rows = await db
    .select({
      id: invois.id,
      noInvois: invois.noInvois,
      jenisInvois: invois.jenisInvois,
      jumlah: invois.jumlah,
      status: invois.status,
      tarikhBayar: invois.tarikhBayar,
      rujukanBayar: invois.rujukanBayar,
      tarikhSah: invois.tarikhSah,
      catatanKewangan: invois.catatanKewangan,
      disahkanOlehName: user.name,
      createdAt: invois.createdAt
    })
    .from(invois)
    .leftJoin(user, eq(invois.disahkanOleh, user.id))
    .where(eq(invois.permohonanId, id))

  return rows
})
