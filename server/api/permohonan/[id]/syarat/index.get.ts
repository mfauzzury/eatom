import { syaratList, getUser } from '../../../../data/dummy'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  return syaratList
    .filter(s => s.permohonanId === id)
    .map(s => ({
      id: s.id,
      kodSyarat: s.kodSyarat,
      penerangan: s.penerangan,
      kategori: s.kategori,
      addedByName: getUser(s.addedBy)?.name ?? null,
      createdAt: s.createdAt,
    }))
})
