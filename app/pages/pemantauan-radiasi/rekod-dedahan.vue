<script setup lang="ts">
definePageMeta({ title: 'Rekod Dedahan' })

const data = ref([
  { id: 1, stesen: 'STN-01', lokasi: 'Bangi, Selangor', purata: '0.082', maksimum: '0.11', minimum: '0.05', tempoh: 'Feb 2026' },
  { id: 2, stesen: 'STN-02', lokasi: 'Dengkil, Selangor', purata: '0.071', maksimum: '0.09', minimum: '0.04', tempoh: 'Feb 2026' },
  { id: 3, stesen: 'STN-03', lokasi: 'Gebeng, Pahang', purata: '0.118', maksimum: '0.15', minimum: '0.08', tempoh: 'Feb 2026' },
  { id: 4, stesen: 'STN-04', lokasi: 'Ulu Kinta, Perak', purata: '0.091', maksimum: '0.12', minimum: '0.06', tempoh: 'Feb 2026' },
  { id: 5, stesen: 'STN-05', lokasi: 'Senai, Johor', purata: '0.065', maksimum: '0.08', minimum: '0.04', tempoh: 'Feb 2026' },
  { id: 6, stesen: 'STN-06', lokasi: 'Georgetown, P. Pinang', purata: '0.098', maksimum: '0.13', minimum: '0.07', tempoh: 'Feb 2026' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.stesen.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'stesen', header: 'Stesen' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'purata', header: 'Purata (μSv/h)' },
  { accessorKey: 'maksimum', header: 'Maks (μSv/h)' },
  { accessorKey: 'minimum', header: 'Min (μSv/h)' },
  { accessorKey: 'tempoh', header: 'Tempoh' }
]

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 300, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  colors: ['#3b82f6', '#ef4444'],
  xaxis: { categories: ['STN-01', 'STN-02', 'STN-03', 'STN-04', 'STN-05', 'STN-06'] },
  yaxis: { title: { text: 'μSv/h' } },
  legend: { position: 'top' as const, fontSize: '11px' },
  dataLabels: { enabled: false }
}))
const chartSeries = ref([
  { name: 'Purata', data: [0.082, 0.071, 0.118, 0.091, 0.065, 0.098] },
  { name: 'Maksimum', data: [0.11, 0.09, 0.15, 0.12, 0.08, 0.13] }
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Rekod Dedahan</h2>
      <p class="text-sm text-gray-500">Rekod dedahan radiasi persekitaran mengikut stesen pemonitoran</p>
    </div>
    <UCard>
      <template #header><p class="text-sm font-semibold text-gray-700">Perbandingan Bacaan Mengikut Stesen</p></template>
      <ClientOnly>
        <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
        <template #fallback><div class="h-[300px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
      </ClientOnly>
    </UCard>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-gray-700">Ringkasan Bulanan - Februari 2026</p>
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari stesen..." class="w-56" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns" />
    </UCard>
  </div>
</template>
