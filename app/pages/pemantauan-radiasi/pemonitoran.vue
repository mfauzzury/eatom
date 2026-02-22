<script setup lang="ts">
definePageMeta({ title: 'Pemonitoran & Persampelan' })

const data = ref([
  { id: 1, stesen: 'STN-01', lokasi: 'Bangi, Selangor', bacaanTerkini: '0.08', tarikhBacaan: '22/02/2026 08:00', status: 'Normal' },
  { id: 2, stesen: 'STN-02', lokasi: 'Dengkil, Selangor', bacaanTerkini: '0.07', tarikhBacaan: '22/02/2026 08:00', status: 'Normal' },
  { id: 3, stesen: 'STN-03', lokasi: 'Gebeng, Pahang', bacaanTerkini: '0.12', tarikhBacaan: '22/02/2026 08:00', status: 'Normal' },
  { id: 4, stesen: 'STN-04', lokasi: 'Ulu Kinta, Perak', bacaanTerkini: '0.09', tarikhBacaan: '22/02/2026 08:00', status: 'Normal' },
  { id: 5, stesen: 'STN-05', lokasi: 'Senai, Johor', bacaanTerkini: '0.06', tarikhBacaan: '22/02/2026 07:00', status: 'Penyelenggaraan' },
  { id: 6, stesen: 'STN-06', lokasi: 'Georgetown, Pulau Pinang', bacaanTerkini: '0.10', tarikhBacaan: '22/02/2026 08:00', status: 'Normal' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.stesen.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Stesen Pemonitoran', value: data.value.length, icon: 'i-lucide-radio-tower', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Normal', value: data.value.filter(d => d.status === 'Normal').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Bacaan Melebihi Had', value: data.value.filter(d => d.status === 'Amaran').length, icon: 'i-lucide-alert-triangle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Penyelenggaraan', value: data.value.filter(d => d.status === 'Penyelenggaraan').length, icon: 'i-lucide-wrench', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'stesen', header: 'Stesen' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'bacaanTerkini', header: 'Bacaan (μSv/h)' },
  { accessorKey: 'tarikhBacaan', header: 'Tarikh Bacaan' },
  { accessorKey: 'status', header: 'Status' }
]

const statusColour: Record<string, string> = { Normal: 'success', Penyelenggaraan: 'warning', Amaran: 'error' }

const trendOptions = computed(() => ({
  chart: { type: 'line' as const, height: 280, toolbar: { show: false } },
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  stroke: { width: 2, curve: 'smooth' as const },
  xaxis: { categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
  yaxis: { title: { text: 'μSv/h' }, min: 0, max: 0.25 },
  legend: { position: 'top' as const, fontSize: '11px' },
  dataLabels: { enabled: false }
}))
const trendSeries = ref([
  { name: 'STN-01 Bangi', data: [0.08, 0.07, 0.08, 0.09, 0.08, 0.07, 0.08] },
  { name: 'STN-03 Gebeng', data: [0.11, 0.12, 0.12, 0.13, 0.11, 0.12, 0.11] },
  { name: 'STN-06 Georgetown', data: [0.09, 0.10, 0.10, 0.11, 0.10, 0.09, 0.10] }
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pemonitoran & Persampelan</h2>
      <p class="text-sm text-gray-500">Pemantauan radiasi alam sekitar masa nyata dan pengurusan persampelan</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <UCard>
      <template #header><p class="text-sm font-semibold text-gray-700">Trend Bacaan Radiasi (24 Jam Terakhir)</p></template>
      <ClientOnly>
        <apexchart type="line" height="280" :options="trendOptions" :series="trendSeries" />
        <template #fallback><div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
      </ClientOnly>
    </UCard>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-gray-700">Stesen Pemonitoran</p>
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari stesen..." class="w-56" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
