import { requireRole, insertAuditTrail } from '../../utils/rbac'

function generateNoRujukan() {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `BPP/${year}/${random}`
}

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, ['PL', 'ADMIN'])
  const body = await readBody(event)

  const {
    jenisPermohonan, keterangan, submit,
    kategoriLesen, subKategori, lokasi, aktiviti, bilPeralatan, noLesenSediaAda,
  } = body

  const status = submit ? 'dikemukakan' : 'draf'
  const noRujukan = generateNoRujukan()

  const permohonan = {
    id: Date.now(),
    noRujukan,
    syarikatId: 1,
    jenisPermohonan: jenisPermohonan ?? 'baru',
    status,
    kategoriLesen: kategoriLesen ?? null,
    subKategori: subKategori ?? null,
    lokasi: lokasi ?? null,
    aktiviti: aktiviti ?? null,
    bilPeralatan: bilPeralatan ?? null,
    noLesenSediaAda: noLesenSediaAda ?? null,
    keteranganPermohonan: keterangan ?? null,
    kategoriKawalan: null,
    catatanKategori: null,
    catatanPS: null,
    catatanKU: null,
    assignedPSId: null,
    assignedKUId: null,
    createdBy: session.user.id,
    submittedAt: submit ? new Date() : null,
    approvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await insertAuditTrail({
    userId: session.user.id,
    action: submit ? 'SUBMIT_PERMOHONAN' : 'CREATE_DRAF',
    resourceType: 'permohonan_lesen',
    resourceId: String(permohonan.id),
    newValue: { status, noRujukan },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return permohonan
})
