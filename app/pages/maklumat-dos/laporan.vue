<script setup lang="ts">
definePageMeta({ title: 'Laporan & Statistik Dos' })
const toast = useToast()

const reports = ref([
  { id: 1, nama: 'Laporan Tahunan Dos Pekerja Sinaran 2025', tarikh: '15/01/2026', jenis: 'Tahunan', status: 'Diterbitkan' },
  { id: 2, nama: 'Ringkasan Statistik Dos Q4 2025', tarikh: '10/01/2026', jenis: 'Suku Tahunan', status: 'Diterbitkan' },
  { id: 3, nama: 'Laporan Khas - Analisis Dos Melebihi Had Siasatan', tarikh: '20/12/2025', jenis: 'Khas', status: 'Diterbitkan' },
  { id: 4, nama: 'Ringkasan Statistik Dos Q1 2026', tarikh: '-', jenis: 'Suku Tahunan', status: 'Dalam Penyediaan' }
])

const search = ref('')
const filteredReports = computed(() => {
  if (!search.value) return reports.value
  const q = search.value.toLowerCase()
  return reports.value.filter(d => d.nama.toLowerCase().includes(q) || d.jenis.toLowerCase().includes(q))
})

const reportColumns = [
  { accessorKey: 'nama', header: 'Nama Laporan' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Diterbitkan: 'success', 'Dalam Penyediaan': 'warning' }
const jenisOptions = ['Tahunan', 'Suku Tahunan', 'Khas'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', jenis: '', tarikh: '-', status: 'Dalam Penyediaan' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', jenis: '', tarikh: '-', status: 'Dalam Penyediaan' })
  showModal.value = true
}
function openEdit(item: typeof reports.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, jenis: item.jenis, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = reports.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(reports.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...reports.value.map(d => d.id), 0)
    reports.value.push({ id: maxId + 1, ...form })
    toast.add({ title: 'Berjaya', description: 'Laporan berjaya dijana.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { reports.value = reports.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function publishReport(id: number) {
  const item = reports.value.find(d => d.id === id)
  if (item) { item.status = 'Diterbitkan'; item.tarikh = new Date().toLocaleDateString('en-GB'); toast.add({ title: 'Laporan Diterbitkan', color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 300, stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  xaxis: { categories: ['2020', '2021', '2022', '2023', '2024', '2025'] },
  yaxis: { title: { text: 'Bil. Pekerja' } },
  legend: { position: 'top' as const, fontSize: '11px' },
  dataLabels: { enabled: false }
}))
const chartSeries = ref([
  { name: 'Perubatan', data: [1250, 1320, 1380, 1420, 1510, 1580] },
  { name: 'Industri', data: [980, 1020, 1050, 1100, 1150, 1200] },
  { name: 'Penyelidikan', data: [450, 480, 520, 540, 560, 580] },
  { name: 'Lain-lain', data: [320, 340, 360, 380, 400, 420] }
])

const sektorOptions = computed(() => ({
  chart: { type: 'pie' as const, height: 280 },
  labels: ['Perubatan', 'Industri', 'Penyelidikan', 'Pendidikan', 'Lain-lain'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'],
  legend: { position: 'bottom' as const, fontSize: '11px' }
}))
const sektorSeries = ref([1580, 1200, 580, 250, 170])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Laporan & Statistik Dos</h2>
      <p class="text-sm text-gray-500">Laporan berkala dan analisis statistik dos pekerja sinaran</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <UCard class="lg:col-span-3">
        <template #header><p class="text-sm font-semibold text-gray-700">Pekerja Sinaran Mengikut Sektor (6 Tahun)</p></template>
        <ClientOnly>
          <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[300px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
      <UCard class="lg:col-span-2">
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Sektor (2025)</p></template>
        <ClientOnly>
          <apexchart type="pie" height="280" :options="sektorOptions" :series="sektorSeries" />
          <template #fallback><div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari laporan..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jana Laporan" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredReports" :columns="reportColumns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Dalam Penyediaan'" icon="i-lucide-send" color="success" variant="ghost" size="xs" title="Terbitkan" @click="publishReport(row.original.id)" />
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Laporan' : 'Jana Laporan Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Laporan" required><UInput v-model="form.nama" placeholder="Nama laporan" class="w-full" /></UFormField>
          <UFormField label="Jenis" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.jenis" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Jana' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Laporan</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam laporan ini?</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showDelete = false">Batal</UButton>
            <UButton color="error" @click="doDelete">Padam</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
