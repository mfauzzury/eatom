import { eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { syaratLesen, permohonanLesen, user } from '../../../../db/schema'
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
      id: syaratLesen.id,
      kodSyarat: syaratLesen.kodSyarat,
      penerangan: syaratLesen.penerangan,
      kategori: syaratLesen.kategori,
      addedByName: user.name,
      createdAt: syaratLesen.createdAt
    })
    .from(syaratLesen)
    .leftJoin(user, eq(syaratLesen.addedBy, user.id))
    .where(eq(syaratLesen.permohonanId, id))

  return rows
})
