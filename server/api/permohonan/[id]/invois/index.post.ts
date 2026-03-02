export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { jenisInvois, jumlah } = body

  const noInvois = `INV/2026/${String(Date.now()).slice(-5)}`

  return {
    id: Date.now(),
    noInvois,
    permohonanId: id,
    jenisInvois,
    jumlah,
    status: 'belum_bayar',
    tarikhBayar: null,
    rujukanBayar: null,
    disahkanOleh: null,
    tarikhSah: null,
    catatanKewangan: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})
