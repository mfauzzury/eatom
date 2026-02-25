export default defineEventHandler(async (event) => {
  const invoisId = Number(getRouterParam(event, 'invoisId'))
  const body = await readBody(event)
  const { action } = body

  if (action === 'bayar') return { id: invoisId, status: 'telah_bayar' }
  if (action === 'sahkan') return { id: invoisId, status: 'disahkan' }
  if (action === 'batal') return { id: invoisId, status: 'batal' }

  throw createError({ statusCode: 400, statusMessage: 'Tindakan tidak sah. Gunakan: bayar, sahkan, atau batal.' })
})
