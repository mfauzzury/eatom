import { permohonanList, syarikatList, users, getSyarikat } from '../../data/dummy'
import { requireAuth } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userRole = (session.user as { role?: string }).role
  const userId = session.user.id

  const statusMap: Record<string, number> = {}
  const jenisMap: Record<string, number> = {}
  const kategoriMap: Record<string, number> = {}

  for (const p of permohonanList) {
    statusMap[p.status] = (statusMap[p.status] ?? 0) + 1
    jenisMap[p.jenisPermohonan] = (jenisMap[p.jenisPermohonan] ?? 0) + 1
    if (p.kategoriLesen) kategoriMap[p.kategoriLesen] = (kategoriMap[p.kategoriLesen] ?? 0) + 1
  }

  const jumlahPermohonan = permohonanList.length

  let tugasanSaya = 0
  if (userRole === 'PS') {
    tugasanSaya = (statusMap['dikemukakan'] ?? 0) + (statusMap['semakan_PS'] ?? 0)
  } else if (userRole === 'KU') {
    tugasanSaya = (statusMap['lulus_PS'] ?? 0) + (statusMap['semakan_KU'] ?? 0)
  } else if (userRole === 'PL') {
    tugasanSaya = permohonanList.filter(p => p.createdBy === userId).length
  } else if (['P', 'KP', 'ADMIN'].includes(userRole ?? '')) {
    tugasanSaya = jumlahPermohonan
  }

  const sorted = [...permohonanList].sort((a, b) =>
    (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  )
  const recentPermohonan = sorted.slice(0, 5).map(p => ({
    id: p.id,
    noRujukan: p.noRujukan,
    namaSyarikat: getSyarikat(p.syarikatId)?.namaSyarikat ?? '',
    jenisPermohonan: p.jenisPermohonan,
    status: p.status,
    updatedAt: p.updatedAt,
  }))

  return {
    tugasanSaya,
    jumlahPermohonan,
    dikemukakan: statusMap['dikemukakan'] ?? 0,
    semakan_PS: statusMap['semakan_PS'] ?? 0,
    lulus_PS: statusMap['lulus_PS'] ?? 0,
    semakan_KU: statusMap['semakan_KU'] ?? 0,
    diluluskan: statusMap['diluluskan'] ?? 0,
    ditolak: statusMap['ditolak'] ?? 0,
    draf: statusMap['draf'] ?? 0,
    statusMap,
    jenisMap,
    kategoriMap,
    recentPermohonan,
    jumlahSyarikat: syarikatList.filter(s => s.status === 'aktif').length,
    jumlahPengguna: users.length,
  }
})
