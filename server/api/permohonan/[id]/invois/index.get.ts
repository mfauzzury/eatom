import { invoisList, getUser } from '../../../../data/dummy'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  return invoisList
    .filter(i => i.permohonanId === id)
    .map(i => ({
      id: i.id,
      noInvois: i.noInvois,
      jenisInvois: i.jenisInvois,
      jumlah: i.jumlah,
      status: i.status,
      tarikhBayar: i.tarikhBayar,
      rujukanBayar: i.rujukanBayar,
      tarikhSah: i.tarikhSah,
      catatanKewangan: i.catatanKewangan,
      disahkanOlehName: i.disahkanOleh ? getUser(i.disahkanOleh)?.name ?? null : null,
      createdAt: i.createdAt,
    }))
})
