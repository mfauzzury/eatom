<script setup lang="ts">
definePageMeta({ title: 'Laporan Pemantauan' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Laporan Bulanan Pemantauan Radiasi - Januari 2026', tarikh: '05/02/2026', jenis: 'Bulanan', saiz: '3.2 MB', status: 'Diterbitkan' },
  { id: 2, nama: 'Laporan Bulanan Pemantauan Radiasi - Disember 2025', tarikh: '08/01/2026', jenis: 'Bulanan', saiz: '2.9 MB', status: 'Diterbitkan' },
  { id: 3, nama: 'Laporan Tahunan Pemantauan Radiasi 2025', tarikh: '15/01/2026', jenis: 'Tahunan', saiz: '12.5 MB', status: 'Diterbitkan' },
  { id: 4, nama: 'Laporan Khas - Insiden STN-05 (Sep 2025)', tarikh: '20/10/2025', jenis: 'Khas', saiz: '5.1 MB', status: 'Diterbitkan' },
  { id: 5, nama: 'Laporan Bulanan Pemantauan Radiasi - Februari 2026', tarikh: '-', jenis: 'Bulanan', saiz: '-', status: 'Dalam Penyediaan' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.jenis.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'nama', header: 'Nama Laporan' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'tarikh', header: 'Tarikh Terbit' },
  { accessorKey: 'saiz', header: 'Saiz' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Diterbitkan: 'success', 'Dalam Penyediaan': 'warning' }
const jenisOptions = ['Bulanan', 'Tahunan', 'Khas'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', jenis: '', tarikh: '-', saiz: '-', status: 'Dalam Penyediaan' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', jenis: '', tarikh: '-', saiz: '-', status: 'Dalam Penyediaan' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, jenis: item.jenis, tarikh: item.tarikh, saiz: item.saiz, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, ...form })
    toast.add({ title: 'Berjaya', description: 'Laporan berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function publishReport(id: number) {
  const item = data.value.find(d => d.id === id)
  if (item) {
    item.status = 'Diterbitkan'
    item.tarikh = new Date().toLocaleDateString('en-GB')
    item.saiz = (Math.random() * 10 + 1).toFixed(1) + ' MB'
    toast.add({ title: 'Laporan Diterbitkan', description: `${item.nama}`, color: 'success' })
  }
}

const trendOptions = computed(() => ({
  chart: { type: 'area' as const, height: 280, toolbar: { show: false } },
  colors: ['#3b82f6'],
  stroke: { width: 2, curve: 'smooth' as const },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: { categories: ['Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis', 'Jan'] },
  yaxis: { title: { text: 'Purata μSv/h' }, min: 0.05, max: 0.15 },
  dataLabels: { enabled: false }
}))
const trendSeries = ref([{ name: 'Purata Nasional', data: [0.085, 0.088, 0.092, 0.087, 0.083, 0.086, 0.089] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Laporan Pemantauan</h2>
      <p class="text-sm text-gray-500">Laporan berkala dan khas pemantauan radiasi persekitaran</p>
    </div>
    <UCard>
      <template #header><p class="text-sm font-semibold text-gray-700">Trend Purata Bacaan Nasional (7 Bulan)</p></template>
      <ClientOnly>
        <apexchart type="area" height="280" :options="trendOptions" :series="trendSeries" />
        <template #fallback><div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
      </ClientOnly>
    </UCard>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari laporan..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jana Laporan" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
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
