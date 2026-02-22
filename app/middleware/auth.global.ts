import { getMockUser } from '~/composables/useAuth'

const PUBLIC_ROUTES = ['/login', '/daftar', '/gate']
const PUBLIC_PREFIXES = ['/portal']

export default defineNuxtRouteMiddleware((to) => {
  // --- PIN Gate (for cloud demo) ---
  if (to.path !== '/gate' && import.meta.client) {
    const { gatePin } = useRuntimeConfig().public
    if (gatePin) {
      const unlocked = sessionStorage.getItem('eatom_gate') === 'unlocked'
      if (!unlocked) return navigateTo('/gate')
    }
  }

  // --- Existing auth ---
  if (PUBLIC_ROUTES.includes(to.path)) return
  if (PUBLIC_PREFIXES.some(prefix => to.path.startsWith(prefix))) return

  // On server, skip auth check (mock mode — no cookies)
  if (import.meta.server) return

  // Client-side: check localStorage
  const user = getMockUser()
  if (!user) return navigateTo('/login')
})
