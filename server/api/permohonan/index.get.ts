import { permohonanList, getSyarikat } from '../../data/dummy'
import { requireAuth } from '../../utils/rbac'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const userRole = (session.user as { role?: string }).role
  const userId = session.user.id
  const query = getQuery(event)

  const page = Number(query.page ?? 1)
  const limit = Number(query.limit ?? 20)
  const offset = (page - 1) * limit

  let filtered = [...permohonanList]

  if (userRole === 'PL') {
    filtered = filtered.filter(p => p.createdBy === userId)
  } else if (userRole === 'PS') {
    filtered = filtered.filter(p => ['dikemukakan', 'semakan_PS'].includes(p.status))
  } else if (userRole === 'KU') {
    filtered = filtered.filter(p => ['lulus_PS', 'semakan_KU'].includes(p.status))
  }

  if (query.status) {
    filtered = filtered.filter(p => p.status === query.status)
  }

  const sorted = filtered.sort((a, b) =>
    (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  )

  const paged = sorted.slice(offset, offset + limit)
  const data = paged.map(p => {
    const s = getSyarikat(p.syarikatId)
    return {
      id: p.id,
      noRujukan: p.noRujukan,
      jenisPermohonan: p.jenisPermohonan,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      submittedAt: p.submittedAt,
      namaSyarikat: s?.namaSyarikat ?? null,
      noDaftar: s?.noDaftar ?? null,
    }
  })

  return { data, page, limit }
})
