export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  const filePart = formData?.find(p => p.name === 'file')
  const jenisDocPart = formData?.find(p => p.name === 'jenisDoc')

  return {
    id: Date.now(),
    namaFail: filePart?.filename ?? 'dokumen.pdf',
    jenisDoc: jenisDocPart?.data?.toString() ?? 'lain_lain',
    saizFail: filePart?.data?.length ?? 0,
    mimeType: filePart?.type ?? 'application/pdf',
    createdAt: new Date(),
  }
})
