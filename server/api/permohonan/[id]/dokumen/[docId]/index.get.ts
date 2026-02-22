import { and, eq } from 'drizzle-orm'
import { createReadStream } from 'node:fs'
import { access } from 'node:fs/promises'
import { db } from '../../../../../db'
import { dokumenPermohonan } from '../../../../../db/schema'
import { requireAuth } from '../../../../../utils/rbac'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const docId = Number(getRouterParam(event, 'docId'))

  const doc = await db.query.dokumenPermohonan.findFirst({
    where: (d, { and, eq }) => and(eq(d.id, docId), eq(d.permohonanId, id))
  })

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak dijumpai' })
  }

  try {
    await access(doc.storagePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Fail tidak dijumpai di pelayan' })
  }

  setResponseHeader(event, 'Content-Type', doc.mimeType ?? 'application/octet-stream')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(doc.namaFail)}"`)
  if (doc.saizFail) {
    setResponseHeader(event, 'Content-Length', String(doc.saizFail))
  }

  return sendStream(event, createReadStream(doc.storagePath))
})
