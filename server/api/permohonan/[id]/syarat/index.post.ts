export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { kodSyarat, penerangan, kategori } = body

  if (!penerangan?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Penerangan syarat diperlukan.' })
  }

  return {
    id: Date.now(),
    permohonanId: id,
    kodSyarat: kodSyarat || null,
    penerangan,
    kategori: kategori || null,
    addedBy: 'user-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})
