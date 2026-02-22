// Shared mock data for POC — no backend required

export interface Permohonan {
  id: number
  noRujukan: string
  namaSyarikat: string
  noDaftar: string
  alamat: string
  poskod: string
  negeri: string
  tel: string
  emailSyarikat: string
  jenisPermohonan: string
  status: string
  kategoriLesen: string
  subKategori: string
  lokasi: string
  aktiviti: string
  bilPeralatan: number | null
  noLesenSediaAda: string
  keteranganPermohonan: string
  kategoriKawalan: string
  catatanKategori: string
  catatanPS: string
  catatanKU: string
  createdByName: string
  submittedAt: string
  approvedAt: string
  createdAt: string
  updatedAt: string
}

const _permohonanList: Permohonan[] = [
  { id: 1, noRujukan: 'PL/2025/0001', namaSyarikat: 'Syarikat Atom Sdn Bhd', noDaftar: 'SA-2020-00123', alamat: 'No 1 Jalan Atom, Bangi', poskod: '43650', negeri: 'Selangor', tel: '03-89117890', emailSyarikat: 'info@atom.com.my', jenisPermohonan: 'baru', status: 'diluluskan', kategoriLesen: 'industri', subKategori: 'radiografi_industri', lokasi: 'Kilang Bangi', aktiviti: 'Radiografi perindustrian untuk ujian NDT', bilPeralatan: 3, noLesenSediaAda: '', keteranganPermohonan: 'Permohonan baru untuk aktiviti NDT', kategoriKawalan: 'A', catatanKategori: 'Sumber sinaran berkekuatan tinggi', catatanPS: 'Dokumen lengkap', catatanKU: 'Syarikat memenuhi semua syarat', createdByName: 'Syarikat Atom PL', submittedAt: '2025-09-15', approvedAt: '2025-10-20', createdAt: '2025-09-10', updatedAt: '2025-10-20' },
  { id: 2, noRujukan: 'PL/2025/0002', namaSyarikat: 'Radiasi Teknik Sdn Bhd', noDaftar: 'RT-2019-00456', alamat: 'Lot 5 Kawasan Perindustrian Senai', poskod: '81400', negeri: 'Johor', tel: '07-5984321', emailSyarikat: 'admin@radiasiteknik.my', jenisPermohonan: 'perbaharui', status: 'diluluskan', kategoriLesen: 'industri', subKategori: 'tolok_sinaran', lokasi: '', aktiviti: 'Tolok ketebalan dan tolok aras', bilPeralatan: 8, noLesenSediaAda: 'L/JHR/2022/0456', keteranganPermohonan: 'Pembaharuan lesen tolok sinaran', kategoriKawalan: 'C', catatanKategori: '', catatanPS: 'Rekod pematuhan baik', catatanKU: 'Diluluskan', createdByName: 'Syarikat Atom PL', submittedAt: '2025-08-20', approvedAt: '2025-09-25', createdAt: '2025-08-15', updatedAt: '2025-09-25' },
  { id: 3, noRujukan: 'PL/2025/0003', namaSyarikat: 'Perubatan Nuklear KL', noDaftar: 'PN-2021-00789', alamat: 'Hospital XYZ, Jalan Raja Muda', poskod: '50300', negeri: 'W.P. Kuala Lumpur', tel: '03-26985432', emailSyarikat: 'nuklear@hospitalxyz.my', jenisPermohonan: 'baru', status: 'semakan_KU', kategoriLesen: 'perubatan', subKategori: 'perubatan_nuklear', lokasi: 'Hospital XYZ Jabatan Nuklear', aktiviti: 'Pengimejan dan terapi perubatan nuklear', bilPeralatan: 5, noLesenSediaAda: '', keteranganPermohonan: 'Permohonan baru jabatan perubatan nuklear', kategoriKawalan: '', catatanKategori: '', catatanPS: 'Semua dokumen disemak dan lengkap', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-01-10', approvedAt: '', createdAt: '2026-01-05', updatedAt: '2026-02-10' },
  { id: 4, noRujukan: 'PL/2025/0004', namaSyarikat: 'Gamma Industrial Services', noDaftar: 'GI-2018-00321', alamat: '22 Jalan Industri 3, Prai', poskod: '13600', negeri: 'Pulau Pinang', tel: '04-3907654', emailSyarikat: 'ops@gammaindustrial.my', jenisPermohonan: 'baru', status: 'lulus_PS', kategoriLesen: 'industri', subKategori: 'well_logging', lokasi: 'Tapak telaga minyak Terengganu', aktiviti: 'Well logging dengan sumber neutron', bilPeralatan: 2, noLesenSediaAda: '', keteranganPermohonan: 'Aktiviti well logging untuk eksplorasi', kategoriKawalan: '', catatanKategori: '', catatanPS: 'Dokumen lengkap, latar belakang syarikat baik', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-01-20', approvedAt: '', createdAt: '2026-01-18', updatedAt: '2026-02-05' },
  { id: 5, noRujukan: 'PL/2025/0005', namaSyarikat: 'MediRad Diagnostik Sdn Bhd', noDaftar: 'MR-2022-00654', alamat: '8 Jalan Kesihatan, Putrajaya', poskod: '62000', negeri: 'W.P. Putrajaya', tel: '03-88721234', emailSyarikat: 'info@mediradd.my', jenisPermohonan: 'baru', status: 'semakan_PS', kategoriLesen: 'perubatan', subKategori: 'diagnosis_xray', lokasi: 'Klinik MediRad Putrajaya', aktiviti: 'Diagnosis X-ray dan mamografi', bilPeralatan: 4, noLesenSediaAda: '', keteranganPermohonan: 'Permohonan lesen peralatan X-ray diagnostik', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-02-01', approvedAt: '', createdAt: '2026-01-28', updatedAt: '2026-02-12' },
  { id: 6, noRujukan: 'PL/2025/0006', namaSyarikat: 'SinarTech Engineering', noDaftar: 'ST-2023-00987', alamat: '15 Jalan Teknologi, Cyberjaya', poskod: '63000', negeri: 'Selangor', tel: '03-83209876', emailSyarikat: 'sinartech@eng.my', jenisPermohonan: 'pinda', status: 'semakan_PS', kategoriLesen: 'industri', subKategori: 'radiografi_industri', lokasi: '', aktiviti: 'Pindaan tambah peralatan radiografi', bilPeralatan: 6, noLesenSediaAda: 'L/SEL/2024/0234', keteranganPermohonan: 'Pindaan untuk menambah 2 unit peralatan', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-02-05', approvedAt: '', createdAt: '2026-02-02', updatedAt: '2026-02-14' },
  { id: 7, noRujukan: 'PL/2025/0007', namaSyarikat: 'Isotop Malaysia Berhad', noDaftar: 'IM-2017-00111', alamat: '3 Jalan Nuklear, Dengkil', poskod: '43800', negeri: 'Selangor', tel: '03-87654321', emailSyarikat: 'contact@isotopmy.com', jenisPermohonan: 'baru', status: 'dikemukakan', kategoriLesen: 'penyelidikan', subKategori: 'makmal', lokasi: 'Makmal Penyelidikan Dengkil', aktiviti: 'Penyelidikan menggunakan sumber tertutup', bilPeralatan: 3, noLesenSediaAda: '', keteranganPermohonan: 'Penyelidikan sumber tertutup untuk pertanian', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-02-10', approvedAt: '', createdAt: '2026-02-08', updatedAt: '2026-02-10' },
  { id: 8, noRujukan: 'PL/2025/0008', namaSyarikat: 'Syarikat Atom Sdn Bhd', noDaftar: 'SA-2020-00123', alamat: 'No 1 Jalan Atom, Bangi', poskod: '43650', negeri: 'Selangor', tel: '03-89117890', emailSyarikat: 'info@atom.com.my', jenisPermohonan: 'perbaharui', status: 'dikemukakan', kategoriLesen: 'industri', subKategori: 'radiografi_industri', lokasi: '', aktiviti: 'Pembaharuan lesen radiografi', bilPeralatan: 3, noLesenSediaAda: 'L/SEL/2022/0789', keteranganPermohonan: 'Pembaharuan lesen sedia ada', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2026-02-15', approvedAt: '', createdAt: '2026-02-12', updatedAt: '2026-02-15' },
  { id: 9, noRujukan: 'PL/2025/0009', namaSyarikat: 'Gamma Industrial Services', noDaftar: 'GI-2018-00321', alamat: '22 Jalan Industri 3, Prai', poskod: '13600', negeri: 'Pulau Pinang', tel: '04-3907654', emailSyarikat: 'ops@gammaindustrial.my', jenisPermohonan: 'baru', status: 'draf', kategoriLesen: 'industri', subKategori: 'penyinaran_makanan', lokasi: 'Kilang Penyinaran Prai', aktiviti: 'Penyinaran makanan untuk pengawetan', bilPeralatan: 1, noLesenSediaAda: '', keteranganPermohonan: '', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '', approvedAt: '', createdAt: '2026-02-18', updatedAt: '2026-02-18' },
  { id: 10, noRujukan: 'PL/2025/0010', namaSyarikat: 'Perubatan Nuklear KL', noDaftar: 'PN-2021-00789', alamat: 'Hospital XYZ, Jalan Raja Muda', poskod: '50300', negeri: 'W.P. Kuala Lumpur', tel: '03-26985432', emailSyarikat: 'nuklear@hospitalxyz.my', jenisPermohonan: 'pinda', status: 'draf', kategoriLesen: 'perubatan', subKategori: 'radioterapi', lokasi: '', aktiviti: 'Pindaan tambah peralatan radioterapi', bilPeralatan: 2, noLesenSediaAda: 'L/KL/2024/0567', keteranganPermohonan: '', kategoriKawalan: '', catatanKategori: '', catatanPS: '', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '', approvedAt: '', createdAt: '2026-02-20', updatedAt: '2026-02-20' },
  { id: 11, noRujukan: 'PL/2025/0011', namaSyarikat: 'Radiasi Teknik Sdn Bhd', noDaftar: 'RT-2019-00456', alamat: 'Lot 5 Kawasan Perindustrian Senai', poskod: '81400', negeri: 'Johor', tel: '07-5984321', emailSyarikat: 'admin@radiasiteknik.my', jenisPermohonan: 'baru', status: 'ditolak', kategoriLesen: 'industri', subKategori: 'radiografi_industri', lokasi: '', aktiviti: 'Radiografi NDT', bilPeralatan: 2, noLesenSediaAda: '', keteranganPermohonan: 'Permohonan NDT', kategoriKawalan: '', catatanKategori: '', catatanPS: 'Dokumen tidak lengkap — surat sokongan tiada', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2025-11-01', approvedAt: '', createdAt: '2025-10-28', updatedAt: '2025-11-20' },
  { id: 12, noRujukan: 'PL/2025/0012', namaSyarikat: 'MediRad Diagnostik Sdn Bhd', noDaftar: 'MR-2022-00654', alamat: '8 Jalan Kesihatan, Putrajaya', poskod: '62000', negeri: 'W.P. Putrajaya', tel: '03-88721234', emailSyarikat: 'info@mediradd.my', jenisPermohonan: 'perbaharui', status: 'ditolak', kategoriLesen: 'perubatan', subKategori: 'diagnosis_xray', lokasi: '', aktiviti: 'Pembaharuan lesen X-ray', bilPeralatan: 2, noLesenSediaAda: 'L/WP/2023/0089', keteranganPermohonan: 'Pembaharuan lesen', kategoriKawalan: '', catatanKategori: '', catatanPS: 'Lesen asal sudah tamat lebih 6 bulan — perlu mohon baru', catatanKU: '', createdByName: 'Syarikat Atom PL', submittedAt: '2025-12-01', approvedAt: '', createdAt: '2025-11-25', updatedAt: '2025-12-15' },
]

export const useMockData = () => {
  const permohonanList = useState<Permohonan[]>('mock_permohonan', () => _permohonanList)

  function getPermohonan(id: number) {
    return permohonanList.value.find(p => p.id === id) ?? null
  }

  function getByRujukan(noRujukan: string) {
    return permohonanList.value.find(
      p => p.noRujukan.toLowerCase() === noRujukan.toLowerCase().trim()
    ) ?? null
  }

  function getFiltered(search?: string, status?: string) {
    return permohonanList.value.filter(p => {
      if (status && p.status !== status) return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.noRujukan.toLowerCase().includes(q) && !p.namaSyarikat.toLowerCase().includes(q)) return false
      }
      return true
    })
  }

  function addPermohonan(data: Partial<Permohonan>) {
    const maxId = Math.max(...permohonanList.value.map(p => p.id), 0)
    const newP: Permohonan = {
      id: maxId + 1,
      noRujukan: `PL/2026/${String(maxId + 1).padStart(4, '0')}`,
      namaSyarikat: data.namaSyarikat ?? '',
      noDaftar: data.noDaftar ?? '',
      alamat: data.alamat ?? '',
      poskod: data.poskod ?? '',
      negeri: data.negeri ?? '',
      tel: data.tel ?? '',
      emailSyarikat: data.emailSyarikat ?? '',
      jenisPermohonan: data.jenisPermohonan ?? 'baru',
      status: data.status ?? 'draf',
      kategoriLesen: data.kategoriLesen ?? '',
      subKategori: data.subKategori ?? '',
      lokasi: data.lokasi ?? '',
      aktiviti: data.aktiviti ?? '',
      bilPeralatan: data.bilPeralatan ?? null,
      noLesenSediaAda: data.noLesenSediaAda ?? '',
      keteranganPermohonan: data.keteranganPermohonan ?? '',
      kategoriKawalan: '',
      catatanKategori: '',
      catatanPS: '',
      catatanKU: '',
      createdByName: 'Pemohon',
      submittedAt: data.status === 'dikemukakan' ? new Date().toISOString().split('T')[0] : '',
      approvedAt: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    permohonanList.value.push(newP)
    return newP
  }

  function updatePermohonan(id: number, data: Partial<Permohonan>) {
    const idx = permohonanList.value.findIndex(p => p.id === id)
    if (idx >= 0) {
      permohonanList.value[idx] = { ...permohonanList.value[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] }
    }
  }

  // Stats for dashboard
  const stats = computed(() => {
    const list = permohonanList.value
    const statusMap: Record<string, number> = {}
    const jenisMap: Record<string, number> = {}
    const kategoriMap: Record<string, number> = {}
    for (const p of list) {
      statusMap[p.status] = (statusMap[p.status] ?? 0) + 1
      jenisMap[p.jenisPermohonan] = (jenisMap[p.jenisPermohonan] ?? 0) + 1
      if (p.kategoriLesen) kategoriMap[p.kategoriLesen] = (kategoriMap[p.kategoriLesen] ?? 0) + 1
    }
    return {
      jumlahPermohonan: list.length,
      diluluskan: statusMap['diluluskan'] ?? 0,
      ditolak: statusMap['ditolak'] ?? 0,
      dikemukakan: statusMap['dikemukakan'] ?? 0,
      semakan_PS: statusMap['semakan_PS'] ?? 0,
      lulus_PS: statusMap['lulus_PS'] ?? 0,
      semakan_KU: statusMap['semakan_KU'] ?? 0,
      draf: statusMap['draf'] ?? 0,
      statusMap,
      jenisMap,
      kategoriMap,
      jumlahSyarikat: 7,
      jumlahPengguna: 5,
      tugasanSaya: (statusMap['dikemukakan'] ?? 0) + (statusMap['semakan_PS'] ?? 0) + (statusMap['semakan_KU'] ?? 0),
      recentPermohonan: list.slice(-5).reverse()
    }
  })

  return { permohonanList, getPermohonan, getByRujukan, getFiltered, addPermohonan, updatePermohonan, stats }
}
