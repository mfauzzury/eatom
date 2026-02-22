import { eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { dokumenPermohonan, permohonanLesen, user } from '../../../../db/schema'
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

  const docs = await db
    .select({
      id: dokumenPermohonan.id,
      namaFail: dokumenPermohonan.namaFail,
      jenisDoc: dokumenPermohonan.jenisDoc,
      saizFail: dokumenPermohonan.saizFail,
      mimeType: dokumenPermohonan.mimeType,
      createdAt: dokumenPermohonan.createdAt,
      uploadedByName: user.name
    })
    .from(dokumenPermohonan)
    .leftJoin(user, eq(dokumenPermohonan.uploadedBy, user.id))
    .where(eq(dokumenPermohonan.permohonanId, id))

  return docs
})
