// Dummy data layer — replaces SQLite for Vercel deployment

const now = Date.now()
const day = 86400 * 1000

// ─── Users ───────────────────────────────────────────────
export const users = [
  { id: 'user-1', name: 'Ahmad Admin', email: 'admin@eatom.gov.my', emailVerified: true, image: null, role: 'ADMIN' as const, bahagian: 'Pentadbiran', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'user-2', name: 'Siti Semakan', email: 'ps@eatom.gov.my', emailVerified: true, image: null, role: 'PS' as const, bahagian: 'BPP', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'user-3', name: 'Kamal Ketua', email: 'ku@eatom.gov.my', emailVerified: true, image: null, role: 'KU' as const, bahagian: 'BPP', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'user-4', name: 'Pengarah Penilaian', email: 'p@eatom.gov.my', emailVerified: true, image: null, role: 'P' as const, bahagian: 'BPP', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'user-5', name: 'Syarikat Atom PL', email: 'pl@syarikat.com', emailVerified: true, image: null, role: 'PL' as const, bahagian: '', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
]

// ─── Syarikat (Companies) ────────────────────────────────
export const syarikatList = [
  { id: 1, namaSyarikat: 'Syarikat Atom Sdn Bhd', noDaftar: 'SA-2024-001', alamat: 'No. 1, Jalan Atom, Bandar Baru Bangi', poskod: '43650', negeri: 'Selangor', tel: '03-89111234', email: 'info@syarikat-atom.com', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 2, namaSyarikat: 'Radiasi Teknik Sdn Bhd', noDaftar: 'RT-2024-002', alamat: 'Lot 5, Kawasan Perindustrian Gebeng', poskod: '26080', negeri: 'Pahang', tel: '09-5831234', email: 'admin@radiasi-teknik.com', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 3, namaSyarikat: 'Perubatan Nuklear KL', noDaftar: 'PNK-2024-003', alamat: '22, Jalan Tun Razak, Kuala Lumpur', poskod: '50400', negeri: 'Wilayah Persekutuan', tel: '03-21611234', email: 'info@pnkl.com.my', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 4, namaSyarikat: 'Gamma Industrial Services', noDaftar: 'GIS-2024-004', alamat: 'Blok A, Kompleks Industri Senai', poskod: '81400', negeri: 'Johor', tel: '07-5991234', email: 'ops@gamma-ind.com', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 5, namaSyarikat: 'MediRad Diagnostik Sdn Bhd', noDaftar: 'MRD-2024-005', alamat: '15, Jalan Sultan Ahmad Shah', poskod: '10050', negeri: 'Pulau Pinang', tel: '04-2281234', email: 'info@medirad.com.my', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 6, namaSyarikat: 'SinarTech Engineering', noDaftar: 'STE-2025-006', alamat: 'Wisma SinarTech, Jalan Duta', poskod: '50480', negeri: 'Wilayah Persekutuan', tel: '03-62051234', email: 'contact@sinartech.com', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 7, namaSyarikat: 'Isotop Malaysia Berhad', noDaftar: 'IMB-2025-007', alamat: 'Menara Isotop, Cyberjaya', poskod: '63000', negeri: 'Selangor', tel: '03-83221234', email: 'admin@isotop.com.my', status: 'aktif' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
]

// ─── Permohonan Lesen (License Applications) ─────────────
export const permohonanList = [
  {
    id: 1, noRujukan: 'PL/2025/0001', syarikatId: 1,
    jenisPermohonan: 'baru' as const, status: 'diluluskan' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Radiodiagnosis',
    lokasi: 'Hospital Serdang, Selangor',
    aktiviti: 'Penggunaan peralatan X-ray untuk diagnostik perubatan',
    bilPeralatan: 3, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: 'B', catatanKategori: null,
    catatanPS: 'Dokumen lengkap. Disyorkan untuk kelulusan.',
    catatanKU: 'Diluluskan. Syarikat memenuhi semua syarat.',
    assignedPSId: 'user-2', assignedKUId: 'user-3', createdBy: 'user-5',
    submittedAt: new Date(now - 30 * day), approvedAt: new Date(now - 5 * day),
    createdAt: new Date(now - 35 * day), updatedAt: new Date(now - 5 * day),
  },
  {
    id: 2, noRujukan: 'PL/2025/0002', syarikatId: 2,
    jenisPermohonan: 'baru' as const, status: 'diluluskan' as const,
    kategoriLesen: 'Industri', subKategori: 'Gauging',
    lokasi: 'Kilang Gebeng, Kuantan',
    aktiviti: 'Penggunaan sumber sinaran untuk pengukuran ketebalan',
    bilPeralatan: 5, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: 'C', catatanKategori: null,
    catatanPS: 'Semua dokumen disahkan. Lulus.',
    catatanKU: 'Diluluskan.',
    assignedPSId: 'user-2', assignedKUId: 'user-3', createdBy: 'user-5',
    submittedAt: new Date(now - 28 * day), approvedAt: new Date(now - 3 * day),
    createdAt: new Date(now - 32 * day), updatedAt: new Date(now - 3 * day),
  },
  {
    id: 3, noRujukan: 'PL/2025/0003', syarikatId: 3,
    jenisPermohonan: 'baru' as const, status: 'semakan_KU' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Nuklear Perubatan',
    lokasi: 'Klinik PNK, Jalan Tun Razak, KL',
    aktiviti: 'Penggunaan bahan radioaktif untuk diagnostik dan rawatan',
    bilPeralatan: 2, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: 'Dokumen lengkap. Cadangan kategori kawalan A.',
    catatanKU: null,
    assignedPSId: 'user-2', assignedKUId: 'user-3', createdBy: 'user-5',
    submittedAt: new Date(now - 14 * day), approvedAt: null,
    createdAt: new Date(now - 20 * day), updatedAt: new Date(now - 2 * day),
  },
  {
    id: 4, noRujukan: 'PL/2025/0004', syarikatId: 4,
    jenisPermohonan: 'pinda' as const, status: 'lulus_PS' as const,
    kategoriLesen: 'Industri', subKategori: 'Radiografi Industri',
    lokasi: 'Kompleks Industri Senai, Johor',
    aktiviti: 'Pengujian tanpa musnah (NDT) menggunakan sumber gamma',
    bilPeralatan: 4, noLesenSediaAda: 'L/JHR/2023/0456',
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: 'Pindaan untuk tambahan 2 unit peralatan baru.',
    catatanKU: null,
    assignedPSId: 'user-2', assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 10 * day), approvedAt: null,
    createdAt: new Date(now - 15 * day), updatedAt: new Date(now - 4 * day),
  },
  {
    id: 5, noRujukan: 'PL/2025/0005', syarikatId: 5,
    jenisPermohonan: 'baru' as const, status: 'semakan_PS' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Radioterapi',
    lokasi: 'MediRad Centre, Georgetown, Pulau Pinang',
    aktiviti: 'Rawatan kanser menggunakan linear accelerator',
    bilPeralatan: 1, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: 'user-2', assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 7 * day), approvedAt: null,
    createdAt: new Date(now - 12 * day), updatedAt: new Date(now - 3 * day),
  },
  {
    id: 6, noRujukan: 'PL/2025/0006', syarikatId: 6,
    jenisPermohonan: 'perbaharui' as const, status: 'semakan_PS' as const,
    kategoriLesen: 'Industri', subKategori: 'Well Logging',
    lokasi: 'Pejabat SinarTech, Jalan Duta, KL',
    aktiviti: 'Penggunaan sumber sinaran untuk well logging',
    bilPeralatan: 8, noLesenSediaAda: 'L/KL/2022/0123',
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: 'user-2', assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 5 * day), approvedAt: null,
    createdAt: new Date(now - 8 * day), updatedAt: new Date(now - 2 * day),
  },
  {
    id: 7, noRujukan: 'PL/2025/0007', syarikatId: 7,
    jenisPermohonan: 'baru' as const, status: 'dikemukakan' as const,
    kategoriLesen: 'Penyelidikan', subKategori: 'Penyelidikan Akademik',
    lokasi: 'Makmal Isotop, Cyberjaya',
    aktiviti: 'Penyelidikan menggunakan isotop radioaktif',
    bilPeralatan: 6, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: null, assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 2 * day), approvedAt: null,
    createdAt: new Date(now - 4 * day), updatedAt: new Date(now - 2 * day),
  },
  {
    id: 8, noRujukan: 'PL/2025/0008', syarikatId: 1,
    jenisPermohonan: 'perbaharui' as const, status: 'dikemukakan' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Radiodiagnosis',
    lokasi: 'Hospital Serdang, Selangor',
    aktiviti: 'Pembaharuan lesen peralatan X-ray sedia ada',
    bilPeralatan: 3, noLesenSediaAda: 'L/SEL/2022/0789',
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: null, assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 1 * day), approvedAt: null,
    createdAt: new Date(now - 3 * day), updatedAt: new Date(now - 1 * day),
  },
  {
    id: 9, noRujukan: 'PL/2025/0009', syarikatId: 2,
    jenisPermohonan: 'baru' as const, status: 'draf' as const,
    kategoriLesen: 'Industri', subKategori: 'Irradiator',
    lokasi: 'Kilang Baru Gebeng, Kuantan',
    aktiviti: 'Pemasangan irradiator untuk pemprosesan makanan',
    bilPeralatan: 1, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: null, assignedKUId: null, createdBy: 'user-5',
    submittedAt: null, approvedAt: null,
    createdAt: new Date(now - 1 * day), updatedAt: new Date(now - 1 * day),
  },
  {
    id: 10, noRujukan: 'PL/2025/0010', syarikatId: 4,
    jenisPermohonan: 'pinda' as const, status: 'draf' as const,
    kategoriLesen: 'Industri', subKategori: 'Radiografi Industri',
    lokasi: 'Tapak Pembinaan Johor Bahru',
    aktiviti: 'Pindaan lokasi kerja radiografi',
    bilPeralatan: 2, noLesenSediaAda: 'L/JHR/2023/0456',
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: null, catatanKU: null,
    assignedPSId: null, assignedKUId: null, createdBy: 'user-5',
    submittedAt: null, approvedAt: null,
    createdAt: new Date(now - 0.5 * day), updatedAt: new Date(now - 0.5 * day),
  },
  {
    id: 11, noRujukan: 'PL/2025/0011', syarikatId: 5,
    jenisPermohonan: 'baru' as const, status: 'ditolak' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Radiodiagnosis',
    lokasi: 'Klinik Swasta, Butterworth',
    aktiviti: 'Pemasangan mesin CT scan',
    bilPeralatan: 1, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: 'Dokumen tidak lengkap - tiada bukti kelayakan PPB.',
    catatanKU: null,
    assignedPSId: 'user-2', assignedKUId: null, createdBy: 'user-5',
    submittedAt: new Date(now - 25 * day), approvedAt: null,
    createdAt: new Date(now - 30 * day), updatedAt: new Date(now - 20 * day),
  },
  {
    id: 12, noRujukan: 'PL/2025/0012', syarikatId: 3,
    jenisPermohonan: 'pinda' as const, status: 'ditolak' as const,
    kategoriLesen: 'Perubatan', subKategori: 'Nuklear Perubatan',
    lokasi: 'Klinik PNK Cawangan Ampang',
    aktiviti: 'Pindaan untuk tambah lokasi baru',
    bilPeralatan: 1, noLesenSediaAda: null,
    keteranganPermohonan: null, kategoriKawalan: null, catatanKategori: null,
    catatanPS: 'Alamat tidak sah. Tidak sepadan rekod SSM.',
    catatanKU: 'Ditolak. Sila kemukakan semula dengan dokumen yang betul.',
    assignedPSId: 'user-2', assignedKUId: 'user-3', createdBy: 'user-5',
    submittedAt: new Date(now - 22 * day), approvedAt: null,
    createdAt: new Date(now - 26 * day), updatedAt: new Date(now - 18 * day),
  },
]

// ─── Dokumen Permohonan ──────────────────────────────────
export const dokumenList: Array<{
  id: number; permohonanId: number; namaFail: string
  jenisDoc: string; saizFail: number; mimeType: string
  storagePath: string; uploadedBy: string; createdAt: Date
}> = []

// ─── Invois ──────────────────────────────────────────────
export const invoisList: Array<{
  id: number; noInvois: string; permohonanId: number
  jenisInvois: string; jumlah: number; status: string
  tarikhBayar: Date | null; rujukanBayar: string | null
  disahkanOleh: string | null; tarikhSah: Date | null
  catatanKewangan: string | null; createdAt: Date; updatedAt: Date
}> = []

// ─── Syarat Lesen ────────────────────────────────────────
export const syaratList: Array<{
  id: number; permohonanId: number; kodSyarat: string | null
  penerangan: string; kategori: string | null; addedBy: string
  createdAt: Date; updatedAt: Date
}> = []

// ─── Audit Trail ─────────────────────────────────────────
export const auditTrailList = [
  { id: 1, userId: 'user-2', action: 'CLAIM', resourceType: 'permohonan_lesen', resourceId: '1', oldValue: null, newValue: JSON.stringify({ assignedPSId: 'user-2' }), ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', createdAt: new Date(now - 31 * day) },
  { id: 2, userId: 'user-2', action: 'APPROVE_PS', resourceType: 'permohonan_lesen', resourceId: '1', oldValue: null, newValue: JSON.stringify({ status: 'lulus_PS' }), ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', createdAt: new Date(now - 28 * day) },
  { id: 3, userId: 'user-3', action: 'CLAIM_KU', resourceType: 'permohonan_lesen', resourceId: '1', oldValue: null, newValue: JSON.stringify({ assignedKUId: 'user-3' }), ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', createdAt: new Date(now - 10 * day) },
  { id: 4, userId: 'user-3', action: 'APPROVE_KU', resourceType: 'permohonan_lesen', resourceId: '1', oldValue: null, newValue: JSON.stringify({ status: 'diluluskan' }), ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', createdAt: new Date(now - 5 * day) },
  { id: 5, userId: 'user-2', action: 'REJECT_PS', resourceType: 'permohonan_lesen', resourceId: '11', oldValue: null, newValue: JSON.stringify({ status: 'ditolak' }), ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', createdAt: new Date(now - 20 * day) },
]

// ─── Helpers ─────────────────────────────────────────────
export function getSyarikat(id: number) {
  return syarikatList.find(s => s.id === id)
}

export function getUser(id: string) {
  return users.find(u => u.id === id)
}
