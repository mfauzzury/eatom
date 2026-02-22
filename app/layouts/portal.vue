<script setup lang="ts">
import { mockLogout } from '~/composables/useAuth'
const { user, isLoggedIn, hasRole } = useAuthUser()
const { setUser } = useAuthUser()
const route = useRoute()
const toast = useToast()

const navLinks = [
  { label: 'Utama', to: '/portal', exact: true },
  { label: 'Permohonan Lesen', to: '/portal/permohonan' },
  { label: 'Semak Status', to: '/portal/semak-status' },
  { label: 'Bayaran', to: '/portal/pembayaran' },
]

const mobileMenu = ref(false)

function isActive(link: { to: string; exact?: boolean }) {
  if (link.exact) return route.path === link.to
  return route.path === link.to || route.path.startsWith(link.to + '/')
}

async function handleLogout() {
  mockLogout()
  setUser(null)
  toast.add({ title: 'Log keluar berjaya', color: 'success' })
  await navigateTo('/portal')
}
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Top Utility Bar -->
      <div class="bg-atom-dark text-white">
        <div class="max-w-6xl mx-auto px-6 h-8 flex items-center justify-between text-xs">
          <span class="text-white/60">Portal Rasmi Jabatan Tenaga Atom Malaysia</span>
          <div class="flex items-center gap-4">
            <template v-if="isLoggedIn">
              <span class="text-white/80">
                <UIcon name="i-lucide-user" class="w-3 h-3 mr-1 inline" />
                {{ user?.name }}
              </span>
              <UBadge color="neutral" variant="subtle" size="xs">{{ user?.role }}</UBadge>
              <button class="text-white/60 hover:text-white transition-colors" @click="handleLogout">
                Log Keluar
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/portal/log-masuk" class="text-white/60 hover:text-white transition-colors">Log Masuk</NuxtLink>
              <NuxtLink to="/portal/daftar" class="text-white/60 hover:text-white transition-colors">Daftar</NuxtLink>
            </template>
          </div>
        </div>
      </div>

      <!-- Main Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="h-16 flex items-center justify-between">
            <NuxtLink to="/portal" class="flex items-center gap-3">
              <img src="/logo-atom-bm.png" alt="Jabatan Tenaga Atom" class="h-10" />
            </NuxtLink>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-1">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive(link)
                  ? 'text-atom bg-atom/5'
                  : 'text-gray-500 hover:text-atom hover:bg-atom/5'"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>

            <!-- Desktop CTA -->
            <div class="hidden md:flex items-center gap-2">
              <UButton v-if="hasRole('ADMIN', 'PS', 'KU', 'P', 'KP')" to="/dashboard" color="neutral" variant="ghost" size="sm" icon="i-lucide-layout-dashboard">
                Sistem Dalaman
              </UButton>
              <template v-if="!isLoggedIn">
                <NuxtLink
                  to="/portal/daftar"
                  class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
                >
                  <UIcon name="i-lucide-user-plus" class="w-4 h-4" />
                  Daftar Akaun
                </NuxtLink>
              </template>
              <template v-else>
                <NuxtLink
                  to="/portal/permohonan/baru"
                  class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
                >
                  <UIcon name="i-lucide-plus" class="w-4 h-4" />
                  Permohonan Baru
                </NuxtLink>
              </template>
            </div>

            <!-- Mobile Toggle -->
            <UButton class="md:hidden" :icon="mobileMenu ? 'i-lucide-x' : 'i-lucide-menu'" color="neutral" variant="ghost" size="sm" @click="mobileMenu = !mobileMenu" />
          </div>
        </div>

        <!-- Mobile menu -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenu" class="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div class="px-4 py-3 space-y-1">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                :class="isActive(link) ? 'text-atom bg-atom/5' : 'text-gray-500'"
                @click="mobileMenu = false"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
            <div class="border-t border-gray-100 px-4 py-3">
              <template v-if="!isLoggedIn">
                <div class="flex gap-2">
                  <UButton to="/portal/log-masuk" color="neutral" variant="outline" size="sm" block @click="mobileMenu = false">Log Masuk</UButton>
                  <NuxtLink
                    to="/portal/daftar"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
                    @click="mobileMenu = false"
                  >
                    Daftar
                  </NuxtLink>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">{{ user?.name }}</span>
                  <UBadge color="neutral" variant="subtle" size="xs">{{ user?.role }}</UBadge>
                </div>
                <UButton color="neutral" variant="outline" size="sm" block @click="handleLogout">Log Keluar</UButton>
              </template>
            </div>
          </div>
        </Transition>
      </header>

      <!-- Content -->
      <main class="flex-1">
        <div class="max-w-6xl mx-auto px-6">
          <slot />
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-atom-teal text-white mt-auto">
        <div class="max-w-6xl mx-auto px-6 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
            <!-- Brand -->
            <div class="md:col-span-1">
              <img src="/logo-atom.png" alt="Jabatan Tenaga Atom" class="h-8 brightness-0 invert mb-4" />
              <p class="text-sm text-white/60 leading-relaxed">
                Sistem Pengurusan Perlesenan Tenaga Atom Malaysia untuk bahan sinaran mengion.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <p class="text-sm font-semibold mb-4">Pautan Pantas</p>
              <div class="space-y-2.5">
                <NuxtLink to="/portal" class="block text-sm text-white/60 hover:text-atom-blue transition-colors">Utama</NuxtLink>
                <NuxtLink to="/portal/permohonan" class="block text-sm text-white/60 hover:text-atom-blue transition-colors">Permohonan Lesen</NuxtLink>
                <NuxtLink to="/portal/semak-status" class="block text-sm text-white/60 hover:text-atom-blue transition-colors">Semak Status</NuxtLink>
                <NuxtLink to="/portal/pembayaran" class="block text-sm text-white/60 hover:text-atom-blue transition-colors">Pembayaran</NuxtLink>
              </div>
            </div>

            <!-- Information -->
            <div>
              <p class="text-sm font-semibold mb-4">Maklumat</p>
              <div class="space-y-2.5">
                <p class="text-sm text-white/60">Syarat & Peraturan</p>
                <p class="text-sm text-white/60">Dasar Privasi</p>
                <p class="text-sm text-white/60">Panduan Pengguna</p>
                <p class="text-sm text-white/60">Soalan Lazim</p>
              </div>
            </div>

            <!-- Contact -->
            <div>
              <p class="text-sm font-semibold mb-4">Hubungi Kami</p>
              <div class="space-y-2.5 text-sm text-white/60">
                <p class="flex items-start gap-2">
                  <UIcon name="i-lucide-building-2" class="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Jabatan Tenaga Atom Malaysia<br />Aras 9, Menara PJH, Presint 2<br />62100 W.P. Putrajaya</span>
                </p>
                <p class="flex items-center gap-2">
                  <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0" />
                  03-8880 8000
                </p>
                <p class="flex items-center gap-2">
                  <UIcon name="i-lucide-mail" class="w-4 h-4 shrink-0" />
                  info@aelb.gov.my
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p class="text-xs text-white/40">&copy; 2026 Jabatan Tenaga Atom Malaysia (JTA). Hak cipta terpelihara.</p>
            <p class="text-xs text-white/30">eATOM v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  </UApp>
</template>
