<script setup lang="ts">
import { mockLogout } from '~/composables/useAuth'
const { user, role, isInternal } = useAuthUser()
const route = useRoute()
const expandedModule = ref<string | null>(null)

interface NavChild {
  label: string
  to: string
}
interface NavItem {
  label: string
  icon: string
  to?: string
  children?: NavChild[]
}

function toggleModule(label: string) {
  expandedModule.value = expandedModule.value === label ? null : label
}

function isExpanded(label: string) {
  return expandedModule.value === label
}

function isModuleActive(item: NavItem) {
  if (item.to && route.path.startsWith(item.to)) return true
  return item.children?.some(c => route.path.startsWith(c.to)) ?? false
}

const navItems = computed<NavItem[]>(() => [
  // Dashboard
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  // Modul 1: Perlesenan & Kawalselia
  {
    label: 'Perlesenan & Kawalselia',
    icon: 'i-lucide-shield-check',
    children: [
      { label: 'Permohonan Lesen', to: '/perlesenan/permohonan-lesen' },
      { label: 'Senarai Lulus', to: '/perlesenan/permohonan-lesen/lulus' },
      { label: 'Pendaftaran', to: '/perlesenan/pendaftaran' },
      { label: 'Kebenaran', to: '/perlesenan/kebenaran' },
      { label: 'Peperiksaan & Pensijilan', to: '/perlesenan/peperiksaan' },
      { label: 'Kawalselia', to: '/perlesenan/kawalselia' },
      { label: 'Kewangan', to: '/perlesenan/kewangan' },
    ]
  },
  // Modul 2: Pengurusan Sumber Manusia
  {
    label: 'Sumber Manusia',
    icon: 'i-lucide-users',
    children: [
      { label: 'Mesyuarat', to: '/sumber-manusia/mesyuarat' },
      { label: 'Permohonan Latihan', to: '/sumber-manusia/latihan' },
      { label: 'Rekod Latihan', to: '/sumber-manusia/rekod-latihan' },
      { label: 'Profil Kepakaran', to: '/sumber-manusia/profil-kepakaran' },
      { label: 'Ceramah', to: '/sumber-manusia/ceramah' },
      { label: 'Dokumen Panduan', to: '/sumber-manusia/dokumen-panduan' },
    ]
  },
  // Modul 3: Pemantauan Radiasi Persekitaran
  {
    label: 'Pemantauan Radiasi',
    icon: 'i-lucide-activity',
    children: [
      { label: 'Pemonitoran & Persampelan', to: '/pemantauan-radiasi/pemonitoran' },
      { label: 'ERMS', to: '/pemantauan-radiasi/erms' },
      { label: 'Inventori Peralatan', to: '/pemantauan-radiasi/inventori' },
      { label: 'Rekod Dedahan', to: '/pemantauan-radiasi/rekod-dedahan' },
      { label: 'Laporan', to: '/pemantauan-radiasi/laporan' },
    ]
  },
  // Modul 4: Maklumat Pekerja Sinaran
  {
    label: 'Pekerja Sinaran',
    icon: 'i-lucide-user-round-search',
    children: [
      { label: 'Pendaftaran Peperiksaan', to: '/pekerja-sinaran/pendaftaran' },
      { label: 'Semakan Peperiksaan', to: '/pekerja-sinaran/semakan' },
      { label: 'Pelantikan PPB', to: '/pekerja-sinaran/pelantikan-ppb' },
      { label: 'Maklumbalas', to: '/pekerja-sinaran/maklumbalas' },
    ]
  },
  // Modul 5: Pengurusan Dokumen
  {
    label: 'Pengurusan Dokumen',
    icon: 'i-lucide-folder-open',
    children: [
      { label: 'Maklumat Dokumen', to: '/pengurusan-dokumen/maklumat' },
      { label: 'Pengurusan Surat', to: '/pengurusan-dokumen/surat' },
      { label: 'Kawalan Fail', to: '/pengurusan-dokumen/kawalan-fail' },
      { label: 'Dokumen ISO', to: '/pengurusan-dokumen/iso' },
      { label: 'Mesyuarat', to: '/pengurusan-dokumen/mesyuarat' },
      { label: 'Galeri', to: '/pengurusan-dokumen/galeri' },
    ]
  },
  // Modul 6: Maklumat Dos Pekerja Sinaran
  {
    label: 'Maklumat Dos',
    icon: 'i-lucide-radiation',
    children: [
      { label: 'Rekod Dos Kebangsaan', to: '/maklumat-dos/rekod' },
      { label: 'Laporan & Statistik', to: '/maklumat-dos/laporan' },
    ]
  },
  // Modul 7: Khidmat Pengurusan
  {
    label: 'Khidmat Pengurusan',
    icon: 'i-lucide-building-2',
    children: [
      { label: 'Permohonan BDR', to: '/khidmat-pengurusan/bdr' },
      { label: 'Tempahan Kenderaan', to: '/khidmat-pengurusan/kenderaan' },
      { label: 'Tempahan Bilik', to: '/khidmat-pengurusan/bilik' },
      { label: 'Aduan Kerosakan', to: '/khidmat-pengurusan/aduan' },
      { label: 'Media Kreatif', to: '/khidmat-pengurusan/media' },
      { label: 'Outreach & Promosi', to: '/khidmat-pengurusan/outreach' },
    ]
  },
])

// Auto-expand active module
watchEffect(() => {
  for (const item of navItems.value) {
    if (item.children && isModuleActive(item)) {
      expandedModule.value = item.label
      break
    }
  }
})

const roleLabels: Record<string, string> = {
  ADMIN: 'Pentadbir Sistem',
  PS: 'Pegawai Semakan',
  KU: 'Ketua Unit',
  P: 'Pengarah',
  KP: 'Ketua Pengarah',
  PL: 'Pemegang Lesen',
  AWAM: 'Orang Awam'
}

async function handleSignOut() {
  mockLogout()
  await navigateTo('/login')
}
</script>

<template>
  <UApp>
    <div class="flex h-screen overflow-hidden bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 flex flex-col bg-white border-r border-gray-200">
        <!-- Brand -->
        <div class="flex items-center gap-3 px-4 h-14 border-b border-gray-200">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900">
            <UIcon name="i-lucide-atom" class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-bold text-sm leading-tight text-gray-900">eATOM</p>
            <p class="text-xs text-gray-500 leading-tight">JTA Malaysia</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto p-2 space-y-0.5">
          <template v-for="item in navItems" :key="item.label">
            <!-- Simple link (no children) -->
            <NuxtLink
              v-if="!item.children"
              :to="item.to!"
              class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path.startsWith(item.to!)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
            >
              <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
              {{ item.label }}
            </NuxtLink>

            <!-- Collapsible module (with children) -->
            <div v-else>
              <button
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isModuleActive(item)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
                @click="toggleModule(item.label)"
              >
                <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                <span class="flex-1 text-left">{{ item.label }}</span>
                <UIcon
                  name="i-lucide-chevron-right"
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="isExpanded(item.label) ? 'rotate-90' : ''"
                />
              </button>
              <div v-show="isExpanded(item.label)" class="ml-5 pl-3 border-l border-gray-200 space-y-0.5 mt-0.5">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  :class="$route.path.startsWith(child.to)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </nav>

        <!-- User -->
        <div class="p-2 border-t border-gray-200">
          <div class="flex items-center gap-2.5 px-3 py-2 rounded-md bg-gray-50">
            <UAvatar :alt="user?.name ?? 'U'" size="xs" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900 truncate">{{ user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ roleLabels[role ?? ''] ?? role }}</p>
            </div>
            <UButton
              icon="i-lucide-log-out"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Log Keluar"
              @click="handleSignOut"
            />
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
          <h1 class="text-sm font-semibold text-gray-900">
            {{ $route.meta.title ?? 'Dashboard' }}
          </h1>
          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" aria-label="Notifikasi" />
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 overflow-y-auto p-6">
          <NuxtPage />
        </main>
      </div>
      <!-- Floating back to gate button -->
      <NuxtLink
        to="/gate"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-full shadow-lg transition-colors"
      >
        <UIcon name="i-lucide-arrow-left-right" class="w-3.5 h-3.5" />
        Tukar Sistem
      </NuxtLink>
    </div>
  </UApp>
</template>
