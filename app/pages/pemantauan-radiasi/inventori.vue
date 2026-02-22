<script setup lang="ts">
definePageMeta({ title: 'Inventori Peralatan' })
const toast = useToast()

const data = ref([
  { id: 1, noAset: 'JTA-EQ-001', nama: 'Survey Meter', jenama: 'Ludlum 19', lokasi: 'STN-01 Bangi', tarikhKalibrasi: '15/01/2026', status: 'Aktif' },
  { id: 2, noAset: 'JTA-EQ-002', nama: 'TLD Reader', jenama: 'Harshaw 6600+', lokasi: 'Makmal Dosimetri', tarikhKalibrasi: '10/01/2026', status: 'Aktif' },
  { id: 3, noAset: 'JTA-EQ-003', nama: 'Gamma Spectrometer', jenama: 'Canberra BE3825', lokasi: 'Makmal Analisis', tarikhKalibrasi: '20/12/2025', status: 'Aktif' },
  { id: 4, noAset: 'JTA-EQ-004', nama: 'Air Sampler', jenama: 'F&J Specialty DF-14', lokasi: 'STN-03 Gebeng', tarikhKalibrasi: '05/11/2025', status: 'Penyelenggaraan' },
  { id: 5, noAset: 'JTA-EQ-005', nama: 'Contamination Monitor', jenama: 'Thermo FHT 111M', lokasi: 'STN-06 Georgetown', tarikhKalibrasi: '01/02/2026', status: 'Aktif' },
  { id: 6, noAset: 'JTA-EQ-006', nama: 'Environmental Monitor', jenama: 'Mirion RD200', lokasi: 'STN-05 Senai', tarikhKalibrasi: '15/09/2025', status: 'Rosak' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.noAset.toLowerCase().includes(q) || d.nama.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Peralatan', value: data.value.length, icon: 'i-lucide-box', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Aktif', value: data.value.filter(d => d.status === 'Aktif').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Penyelenggaraan', value: data.value.filter(d => d.status === 'Penyelenggaraan').length, icon: 'i-lucide-wrench', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Rosak', value: data.value.filter(d => d.status === 'Rosak').length, icon: 'i-lucide-trash-2', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noAset', header: 'No. Aset' },
  { accessorKey: 'nama', header: 'Nama Peralatan' },
  { accessorKey: 'jenama', header: 'Jenama/Model' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'tarikhKalibrasi', header: 'Kalibrasi Terakhir' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', Penyelenggaraan: 'warning', Rosak: 'error' }
const statusOptions = ['Aktif', 'Penyelenggaraan', 'Rosak'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', jenama: '', lokasi: '', tarikhKalibrasi: '', status: 'Aktif' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', jenama: '', lokasi: '', tarikhKalibrasi: '', status: 'Aktif' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, jenama: item.jenama, lokasi: item.lokasi, tarikhKalibrasi: item.tarikhKalibrasi, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    const noAset = `JTA-EQ-${String(maxId + 1).padStart(3, '0')}`
    data.value.push({ id: maxId + 1, noAset, ...form })
    toast.add({ title: 'Berjaya', description: 'Peralatan berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Status ditukar kepada ${status}.`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'donut' as const, height: 260 },
  labels: ['Survey Meter', 'TLD Reader', 'Spectrometer', 'Air Sampler', 'Monitor', 'Lain-lain'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'],
  legend: { position: 'bottom' as const, fontSize: '11px' },
  plotOptions: { pie: { donut: { size: '50%' } } }
}))
const chartSeries = ref([18, 8, 6, 12, 14, 10])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Inventori Peralatan</h2>
      <p class="text-sm text-gray-500">Pengurusan aset peralatan pemantauan dan pengukuran radiasi</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari peralatan..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Peralatan" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Penyelenggaraan'" icon="i-lucide-check" color="success" variant="ghost" size="xs" title="Aktifkan" @click="changeStatus(row.original.id, 'Aktif')" />
                <UButton v-if="row.original.status === 'Aktif'" icon="i-lucide-wrench" color="warning" variant="ghost" size="xs" title="Penyelenggaraan" @click="changeStatus(row.original.id, 'Penyelenggaraan')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Jenis Peralatan</p></template>
        <ClientOnly>
          <apexchart type="donut" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[260px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Peralatan' : 'Daftar Peralatan Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Peralatan" required><UInput v-model="form.nama" placeholder="Nama peralatan" class="w-full" /></UFormField>
          <UFormField label="Jenama/Model"><UInput v-model="form.jenama" placeholder="Jenama dan model" class="w-full" /></UFormField>
          <UFormField label="Lokasi" required><UInput v-model="form.lokasi" placeholder="Lokasi peralatan" class="w-full" /></UFormField>
          <UFormField label="Tarikh Kalibrasi"><UInput v-model="form.tarikhKalibrasi" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          <UFormField v-if="isEdit" label="Status"><USelect v-model="form.status" :items="statusOptions" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.lokasi" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod peralatan ini?</p>
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
