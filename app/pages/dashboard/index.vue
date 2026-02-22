<script setup lang="ts">
definePageMeta({ title: 'Dashboard eATOM' })

const { user, role, hasRole } = useAuthUser()
const { stats } = useMockData()

const roleLabels: Record<string, string> = {
  ADMIN: 'Pentadbir Sistem', PS: 'Pegawai Semakan', KU: 'Ketua Unit',
  P: 'Pengarah', KP: 'Ketua Pengarah', PL: 'Pemegang Lesen', AWAM: 'Orang Awam'
}

const statusLabel: Record<string, string> = {
  draf: 'Draf', dikemukakan: 'Dikemukakan', semakan_PS: 'Semakan PS',
  lulus_PS: 'Lulus PS', semakan_KU: 'Semakan KU', diluluskan: 'Diluluskan', ditolak: 'Ditolak'
}

const statusColour: Record<string, string> = {
  draf: 'neutral', dikemukakan: 'info', semakan_PS: 'warning',
  lulus_PS: 'success', semakan_KU: 'warning', diluluskan: 'success', ditolak: 'error'
}

const jenisLabel: Record<string, string> = {
  baru: 'Baru', pinda: 'Pindaan', perbaharui: 'Pembaharuan'
}

// Summary stat cards
const summaryCards = computed(() => [
  { label: 'Jumlah Permohonan', value: stats.value.jumlahPermohonan, icon: 'i-lucide-file-text', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Diluluskan', value: stats.value.diluluskan, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Dalam Proses', value: (stats.value.dikemukakan) + (stats.value.semakan_PS) + (stats.value.lulus_PS) + (stats.value.semakan_KU), icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Ditolak', value: stats.value.ditolak, icon: 'i-lucide-x-circle', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Syarikat Berdaftar', value: stats.value.jumlahSyarikat, icon: 'i-lucide-building-2', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Pengguna Sistem', value: stats.value.jumlahPengguna, icon: 'i-lucide-users', color: 'text-purple-600', bg: 'bg-purple-50' }
])

// --- ApexCharts options ---

// Donut: Status breakdown
const statusDonutOptions = computed(() => ({
  chart: { type: 'donut' as const, height: 280 },
  labels: ['Draf', 'Dikemukakan', 'Semakan PS', 'Lulus PS', 'Semakan KU', 'Diluluskan', 'Ditolak'],
  colors: ['#9ca3af', '#3b82f6', '#f59e0b', '#34d399', '#f97316', '#16a34a', '#ef4444'],
  legend: { position: 'bottom' as const, fontSize: '12px' },
  plotOptions: { pie: { donut: { size: '55%', labels: { show: true, total: { show: true, label: 'Jumlah', fontSize: '14px' } } } } },
  dataLabels: { enabled: false },
  stroke: { width: 2 }
}))
const statusDonutSeries = computed(() => {
  const map = stats.value.statusMap
  return [
    map['draf'] ?? 0, map['dikemukakan'] ?? 0, map['semakan_PS'] ?? 0,
    map['lulus_PS'] ?? 0, map['semakan_KU'] ?? 0, map['diluluskan'] ?? 0, map['ditolak'] ?? 0
  ]
})

// Bar: Jenis permohonan
const jenisBarOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 280, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: '50%' } },
  colors: ['#3b82f6', '#f59e0b', '#10b981'],
  xaxis: { categories: ['Baru', 'Pindaan', 'Pembaharuan'] },
  dataLabels: { enabled: true, style: { fontSize: '13px' } },
  grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: false } } },
  tooltip: { enabled: false }
}))
const jenisBarSeries = computed(() => {
  const map = stats.value.jenisMap
  return [{ name: 'Permohonan', data: [map['baru'] ?? 0, map['pinda'] ?? 0, map['perbaharui'] ?? 0] }]
})

// Bar: Kategori lesen
const kategoriBarOptions = computed(() => {
  const map = stats.value.kategoriMap
  const labels = Object.keys(map)
  return {
    chart: { type: 'bar' as const, height: 280, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
    colors: ['#6366f1'],
    xaxis: { categories: labels },
    dataLabels: { enabled: true, style: { fontSize: '13px' } },
    grid: { xaxis: { lines: { show: false } } },
    tooltip: { enabled: false }
  }
})
const kategoriBarSeries = computed(() => {
  const map = stats.value.kategoriMap
  return [{ name: 'Permohonan', data: Object.values(map) }]
})

// Area: Monthly trend (mock data for POC)
const monthlyTrendOptions = computed(() => ({
  chart: { type: 'area' as const, height: 280, toolbar: { show: false }, sparkline: { enabled: false } },
  colors: ['#3b82f6', '#10b981'],
  stroke: { curve: 'smooth' as const, width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: { categories: ['Sep', 'Okt', 'Nov', 'Dis', 'Jan', 'Feb'], labels: { style: { fontSize: '11px' } } },
  yaxis: { min: 0, labels: { style: { fontSize: '11px' } } },
  legend: { position: 'top' as const, fontSize: '12px' },
  grid: { borderColor: '#f1f5f9' },
  dataLabels: { enabled: false },
  tooltip: { shared: true }
}))
const monthlyTrendSeries = ref([
  { name: 'Permohonan Masuk', data: [3, 5, 4, 6, 8, 4] },
  { name: 'Diluluskan', data: [1, 3, 2, 4, 5, 2] }
])

// Recent permohonan columns
const recentColumns = [
  { accessorKey: 'noRujukan', header: 'No. Rujukan' },
  { accessorKey: 'namaSyarikat', header: 'Syarikat' },
  { accessorKey: 'jenisPermohonan', header: 'Jenis' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

// Mock: upcoming deadlines
const deadlines = ref([
  { label: 'Lesen L/SEL/2022/0789 tamat tempoh', date: '15 Mac 2026', urgency: 'warning' },
  { label: 'Lesen L/JHR/2023/0456 tamat tempoh', date: '28 Mac 2026', urgency: 'info' },
  { label: 'Lesen L/KL/2022/0123 tamat tempoh', date: '10 Apr 2026', urgency: 'info' },
  { label: 'Pembaharuan sijil PPB - MediRad', date: '22 Apr 2026', urgency: 'info' }
])

// Mock: recent activities
const activities = ref([
  { action: 'Permohonan PL/2025/0008 dikemukakan', user: 'Syarikat Atom PL', time: '1 hari lepas', icon: 'i-lucide-send' },
  { action: 'Permohonan PL/2025/0005 mula disemak PS', user: 'Siti Semakan', time: '3 hari lepas', icon: 'i-lucide-eye' },
  { action: 'Permohonan PL/2025/0004 lulus semakan PS', user: 'Siti Semakan', time: '4 hari lepas', icon: 'i-lucide-check' },
  { action: 'Permohonan PL/2025/0001 diluluskan', user: 'Kamal Ketua', time: '5 hari lepas', icon: 'i-lucide-badge-check' },
  { action: 'Permohonan PL/2025/0011 ditolak', user: 'Siti Semakan', time: '20 hari lepas', icon: 'i-lucide-x' }
])

// Module links
const moduleLinks = [
  { label: 'Perlesenan & Kawalselia', icon: 'i-lucide-shield-check', to: '/perlesenan/permohonan-lesen', desc: 'Lesen, Kawalselia, Permit' },
  { label: 'Sumber Manusia', icon: 'i-lucide-users', to: '/sumber-manusia', desc: 'Latihan, Profil, Mesyuarat' },
  { label: 'Pemantauan Radiasi', icon: 'i-lucide-activity', to: '/pemantauan-radiasi', desc: 'Pemonitoran, ERMS' },
  { label: 'Pekerja Sinaran', icon: 'i-lucide-user-round-search', to: '/pekerja-sinaran', desc: 'Pendaftaran, Peperiksaan' },
  { label: 'Pengurusan Dokumen', icon: 'i-lucide-folder-open', to: '/pengurusan-dokumen', desc: 'Surat, Fail, ISO' },
  { label: 'Maklumat Dos', icon: 'i-lucide-radiation', to: '/maklumat-dos', desc: 'Rekod dos, Laporan' },
  { label: 'Khidmat Pengurusan', icon: 'i-lucide-building-2', to: '/khidmat-pengurusan', desc: 'BDR, Kenderaan, Media' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Greeting -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">
          Selamat datang, {{ user?.name }}
        </h2>
        <p class="text-sm text-gray-500 mt-0.5">
          {{ roleLabels[role ?? ''] ?? role }} &mdash; {{ new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
      <UButton
        to="/perlesenan/permohonan-lesen"
        icon="i-lucide-arrow-right"
        color="neutral"
        variant="subtle"
        size="sm"
        label="Lihat Semua Permohonan"
        trailing
      />
    </div>

    <!-- Summary Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <UCard v-for="card in summaryCards" :key="card.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="card.bg">
            <UIcon :name="card.icon" class="w-4 h-4" :class="card.color" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 leading-none">{{ card.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ card.label }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Tugasan Saya banner -->
    <UCard v-if="stats.tugasanSaya" class="border-l-4 border-l-amber-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-50">
            <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ stats.tugasanSaya }} tugasan menunggu tindakan anda</p>
            <p class="text-xs text-gray-500 mt-0.5">
              <span v-if="hasRole('PS')">Permohonan menunggu semakan Pegawai Semakan</span>
              <span v-else-if="hasRole('KU')">Permohonan menunggu kelulusan Ketua Unit</span>
              <span v-else-if="hasRole('PL')">Permohonan anda yang aktif</span>
              <span v-else>Jumlah permohonan dalam sistem</span>
            </p>
          </div>
        </div>
        <UButton to="/perlesenan/permohonan-lesen" color="neutral" variant="outline" size="sm" label="Semak Sekarang" />
      </div>
    </UCard>

    <!-- Charts Row 1: Trend + Donut -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Monthly Trend (area chart) -->
      <UCard class="lg:col-span-3">
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend Permohonan (6 Bulan)</p>
        </template>
        <ClientOnly>
          <apexchart type="area" height="280" :options="monthlyTrendOptions" :series="monthlyTrendSeries" />
          <template #fallback>
            <div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan carta...</div>
          </template>
        </ClientOnly>
      </UCard>

      <!-- Status Donut -->
      <UCard class="lg:col-span-2">
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pecahan Status</p>
        </template>
        <ClientOnly>
          <apexchart type="donut" height="280" :options="statusDonutOptions" :series="statusDonutSeries" />
          <template #fallback>
            <div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan carta...</div>
          </template>
        </ClientOnly>
      </UCard>
    </div>

    <!-- Charts Row 2: Jenis Bar + Kategori Bar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Jenis Permohonan (horizontal bar) -->
      <UCard>
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Permohonan</p>
        </template>
        <ClientOnly>
          <apexchart type="bar" height="280" :options="jenisBarOptions" :series="jenisBarSeries" />
          <template #fallback>
            <div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan carta...</div>
          </template>
        </ClientOnly>
      </UCard>

      <!-- Kategori Lesen (column bar) -->
      <UCard>
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori Lesen</p>
        </template>
        <ClientOnly>
          <apexchart type="bar" height="280" :options="kategoriBarOptions" :series="kategoriBarSeries" />
          <template #fallback>
            <div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan carta...</div>
          </template>
        </ClientOnly>
      </UCard>
    </div>

    <!-- Recent + Activities Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent Permohonan -->
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Permohonan Terkini</p>
              <UButton to="/perlesenan/permohonan-lesen" variant="link" size="xs" color="neutral" label="Lihat semua" trailing-icon="i-lucide-arrow-right" />
            </div>
          </template>
          <UTable
            :data="stats.recentPermohonan"
            :columns="recentColumns"
          >
            <template #jenisPermohonan-cell="{ row }">
              {{ jenisLabel[row.original.jenisPermohonan] ?? row.original.jenisPermohonan }}
            </template>
            <template #status-cell="{ row }">
              <UBadge
                :color="statusColour[row.original.status] ?? 'neutral'"
                variant="soft"
                size="sm"
              >
                {{ statusLabel[row.original.status] ?? row.original.status }}
              </UBadge>
            </template>
            <template #actions-cell="{ row }">
              <UButton
                :to="`/perlesenan/permohonan-lesen/${row.original.id}`"
                icon="i-lucide-eye"
                color="neutral"
                variant="ghost"
                size="xs"
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- Recent Activity Feed -->
      <UCard>
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktiviti Terkini</p>
        </template>
        <div class="space-y-3">
          <div v-for="(a, i) in activities" :key="i" class="flex gap-3">
            <div class="flex flex-col items-center">
              <div class="p-1.5 rounded-full bg-gray-100">
                <UIcon :name="a.icon" class="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div v-if="i < activities.length - 1" class="w-px flex-1 bg-gray-200 mt-1" />
            </div>
            <div class="pb-3">
              <p class="text-xs text-gray-800 leading-snug">{{ a.action }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ a.user }} &middot; {{ a.time }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Deadlines + Modules Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Upcoming Deadlines -->
      <UCard>
        <template #header>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Peringatan Tarikh Luput</p>
        </template>
        <div class="space-y-2">
          <div
            v-for="(d, i) in deadlines"
            :key="i"
            class="flex items-start gap-2.5 p-2 rounded-md"
            :class="d.urgency === 'warning' ? 'bg-amber-50' : 'bg-gray-50'"
          >
            <UIcon
              :name="d.urgency === 'warning' ? 'i-lucide-alert-triangle' : 'i-lucide-calendar'"
              class="w-4 h-4 mt-0.5 shrink-0"
              :class="d.urgency === 'warning' ? 'text-amber-500' : 'text-gray-400'"
            />
            <div>
              <p class="text-xs text-gray-700 leading-snug">{{ d.label }}</p>
              <p class="text-xs font-medium mt-0.5" :class="d.urgency === 'warning' ? 'text-amber-600' : 'text-gray-500'">{{ d.date }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Module Quick Links -->
      <div class="lg:col-span-2">
        <div class="mb-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modul Utama</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          <NuxtLink
            v-for="mod in moduleLinks"
            :key="mod.to"
            :to="mod.to"
            class="group flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <UIcon :name="mod.icon" class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors mt-0.5 shrink-0" />
            <div>
              <p class="text-xs font-medium text-gray-800 leading-tight">{{ mod.label }}</p>
              <p class="text-xs text-gray-400 mt-0.5 leading-tight">{{ mod.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
