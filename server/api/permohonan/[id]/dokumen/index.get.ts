import { dokumenList, getUser } from '../../../../data/dummy'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  return dokumenList
    .filter(d => d.permohonanId === id)
    .map(d => ({
      id: d.id,
      namaFail: d.namaFail,
      jenisDoc: d.jenisDoc,
      saizFail: d.saizFail,
      mimeType: d.mimeType,
      createdAt: d.createdAt,
      uploadedByName: getUser(d.uploadedBy)?.name ?? null,
    }))
})
