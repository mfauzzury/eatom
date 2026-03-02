import { syarikatList } from '../../data/dummy'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const noDaftar = q.noDaftar as string | undefined
  if (!noDaftar) throw createError({ statusCode: 400, statusMessage: 'noDaftar required' })

  const row = syarikatList.find(s => s.noDaftar === noDaftar)
  if (!row) return { ok: false, message: 'Not found' }

  return {
    ok: true,
    data: {
      id: row.id,
      namaSyarikat: row.namaSyarikat,
      noDaftar: row.noDaftar,
      alamat: row.alamat,
      poskod: row.poskod,
      negeri: row.negeri,
      tel: row.tel,
      email: row.email,
    },
  }
})
