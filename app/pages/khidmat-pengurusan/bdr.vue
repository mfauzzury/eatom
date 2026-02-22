<script setup lang="ts">
definePageMeta({ title: 'Permohonan BDR' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Siti Semakan', bahagian: 'BPP', tarikh: '24/02/2026', sebab: 'Penyediaan laporan dari rumah', status: 'Diluluskan' },
  { id: 2, nama: 'Ahmad Admin', bahagian: 'Pentadbiran', tarikh: '24/02/2026', sebab: 'Penyelenggaraan sistem', status: 'Diluluskan' },
  { id: 3, nama: 'Nurul Hafizah', bahagian: 'BPR', tarikh: '25/02/2026', sebab: 'Analisis data pemantauan', status: 'Menunggu' },
  { id: 4, nama: 'Kamal Ketua', bahagian: 'BPP', tarikh: '25/02/2026', sebab: 'Semakan dokumen perlesenan', status: 'Menunggu' },
  { id: 5, nama: 'Mohd Rizal', bahagian: 'BPR', tarikh: '21/02/2026', sebab: 'Penulisan laporan teknikal', status: 'Diluluskan' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.bahagian.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Permohonan', value: data.value.length, icon: 'i-lucide-home', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Diluluskan', value: data.value.filter(d => d.status === 'Diluluskan').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Menunggu', value: data.value.filter(d => d.status === 'Menunggu').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Ditolak', value: data.value.filter(d => d.status === 'Ditolak').length, icon: 'i-lucide-x-circle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'nama', header: 'Nama Pegawai' },
  { accessorKey: 'bahagian', header: 'Bahagian' },
  { accessorKey: 'tarikh', header: 'Tarikh BDR' },
  { accessorKey: 'sebab', header: 'Sebab' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Diluluskan: 'success', Menunggu: 'warning', Ditolak: 'error' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', bahagian: '', tarikh: '', sebab: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', bahagian: '', tarikh: '', sebab: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, bahagian: item.bahagian, tarikh: item.tarikh, sebab: item.sebab, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Permohonan BDR berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Permohonan ${status.toLowerCase()}.`, color: 'success' }) }
}

const trendOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  colors: ['#3b82f6'],
  xaxis: { categories: ['Sep', 'Okt', 'Nov', 'Dis', 'Jan', 'Feb'] },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const trendSeries = ref([{ name: 'Permohonan', data: [22, 25, 30, 18, 26, 28] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Permohonan Bekerja Dari Rumah (BDR)</h2>
      <p class="text-sm text-gray-500">Pengurusan permohonan bekerja dari rumah</p>
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
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Mohon BDR" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <template v-if="row.original.status === 'Menunggu'">
                  <UButton icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Diluluskan')" />
                  <UButton icon="i-lucide-x" color="error" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Ditolak')" />
                </template>
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Permohonan Bulanan</p></template>
        <ClientOnly>
          <apexchart type="bar" height="260" :options="trendOptions" :series="trendSeries" />
          <template #fallback><div class="h-[260px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Permohonan' : 'Mohon BDR' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Bahagian"><UInput v-model="form.bahagian" placeholder="cth: BPP" class="w-full" /></UFormField>
          <UFormField label="Tarikh BDR"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          <UFormField label="Sebab" required><UInput v-model="form.sebab" placeholder="Sebab permohonan" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.sebab" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Permohonan</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam permohonan ini?</p>
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
