import { permohonanList, getSyarikat, getUser } from '../../../data/dummy'
import { requireAuth } from '../../../utils/rbac'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const p = permohonanList.find(r => r.id === id)
  if (!p) {
    throw createError({ statusCode: 404, statusMessage: 'Permohonan tidak dijumpai' })
  }

  const s = getSyarikat(p.syarikatId)
  const creator = getUser(p.createdBy)

  return {
    id: p.id,
    noRujukan: p.noRujukan,
    jenisPermohonan: p.jenisPermohonan,
    status: p.status,
    kategoriLesen: p.kategoriLesen,
    subKategori: p.subKategori,
    lokasi: p.lokasi,
    aktiviti: p.aktiviti,
    bilPeralatan: p.bilPeralatan,
    noLesenSediaAda: p.noLesenSediaAda,
    keteranganPermohonan: p.keteranganPermohonan,
    kategoriKawalan: p.kategoriKawalan,
    catatanKategori: p.catatanKategori,
    catatanPS: p.catatanPS,
    catatanKU: p.catatanKU,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    submittedAt: p.submittedAt,
    approvedAt: p.approvedAt,
    syarikatId: p.syarikatId,
    namaSyarikat: s?.namaSyarikat ?? null,
    noDaftar: s?.noDaftar ?? null,
    alamat: s?.alamat ?? null,
    poskod: s?.poskod ?? null,
    negeri: s?.negeri ?? null,
    tel: s?.tel ?? null,
    emailSyarikat: s?.email ?? null,
    createdByName: creator?.name ?? null,
    createdByEmail: creator?.email ?? null,
  }
})
