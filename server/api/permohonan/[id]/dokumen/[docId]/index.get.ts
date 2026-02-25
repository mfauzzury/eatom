export default defineEventHandler(async () => {
  throw createError({ statusCode: 404, statusMessage: 'Fail tidak dijumpai di pelayan (demo mode)' })
})
