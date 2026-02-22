<script setup lang="ts">
definePageMeta({ title: 'Aduan Kerosakan' })
const toast = useToast()

const data = ref([
  { id: 1, noAduan: 'AD-2026-034', pengadu: 'Siti Semakan', kategori: 'Elektrikal', penerangan: 'Lampu pejabat BPP tidak berfungsi', lokasi: 'Aras 3, BPP', tarikh: '21/02/2026', status: 'Baru' },
  { id: 2, noAduan: 'AD-2026-033', pengadu: 'Ahmad Admin', kategori: 'ICT', penerangan: 'Printer bilik server rosak', lokasi: 'Bilik Server', tarikh: '20/02/2026', status: 'Dalam Tindakan' },
  { id: 3, noAduan: 'AD-2026-032', pengadu: 'Nurul Hafizah', kategori: 'Penghawa Dingin', penerangan: 'Aircond makmal tidak sejuk', lokasi: 'Makmal Analisis', tarikh: '18/02/2026', status: 'Dalam Tindakan' },
  { id: 4, noAduan: 'AD-2026-031', pengadu: 'Kamal Ketua', kategori: 'Bangunan', penerangan: 'Kebocoran siling bilik mesyuarat', lokasi: 'Bilik Mesyuarat 2', tarikh: '15/02/2026', status: 'Selesai' },
  { id: 5, noAduan: 'AD-2026-030', pengadu: 'Mohd Rizal', kategori: 'Elektrikal', penerangan: 'Socket rosak', lokasi: 'Aras 2, BPR', tarikh: '12/02/2026', status: 'Selesai' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.pengadu.toLowerCase().includes(q) || d.penerangan.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Aduan', value: data.value.length, icon: 'i-lucide-alert-circle', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Selesai', value: data.value.filter(d => d.status === 'Selesai').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Dalam Tindakan', value: data.value.filter(d => d.status === 'Dalam Tindakan').length, icon: 'i-lucide-wrench', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Baru', value: data.value.filter(d => d.status === 'Baru').length, icon: 'i-lucide-plus-circle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noAduan', header: 'No. Aduan' },
  { accessorKey: 'pengadu', header: 'Pengadu' },
  { accessorKey: 'kategori', header: 'Kategori' },
  { accessorKey: 'penerangan', header: 'Penerangan' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Selesai: 'success', 'Dalam Tindakan': 'warning', Baru: 'error' }
const kategoriOptions = ['Elektrikal', 'ICT', 'Penghawa Dingin', 'Bangunan', 'Lain-lain'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ pengadu: '', kategori: '', penerangan: '', lokasi: '', tarikh: '', status: 'Baru' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { pengadu: '', kategori: '', penerangan: '', lokasi: '', tarikh: new Date().toLocaleDateString('en-GB'), status: 'Baru' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { pengadu: item.pengadu, kategori: item.kategori, penerangan: item.penerangan, lokasi: item.lokasi, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noAduan: `AD-2026-${String(34 + maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Aduan berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Aduan ${status.toLowerCase()}.`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'donut' as const, height: 250 },
  labels: ['Elektrikal', 'ICT', 'Penghawa Dingin', 'Bangunan', 'Lain-lain'],
  colors: ['#f59e0b', '#3b82f6', '#06b6d4', '#8b5cf6', '#6b7280'],
  legend: { position: 'bottom' as const, fontSize: '11px' },
  plotOptions: { pie: { donut: { size: '50%' } } }
}))
const chartSeries = ref([10, 8, 7, 5, 4])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Aduan Kerosakan</h2>
      <p class="text-sm text-gray-500">Sistem pengurusan aduan kerosakan dan penyelenggaraan</p>
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
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari aduan..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Buat Aduan" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Baru'" icon="i-lucide-play" color="info" variant="ghost" size="xs" title="Dalam Tindakan" @click="changeStatus(row.original.id, 'Dalam Tindakan')" />
                <UButton v-if="row.original.status === 'Dalam Tindakan'" icon="i-lucide-check-check" color="success" variant="ghost" size="xs" title="Selesai" @click="changeStatus(row.original.id, 'Selesai')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Kategori Aduan</p></template>
        <ClientOnly>
          <apexchart type="donut" height="250" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[250px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Aduan' : 'Buat Aduan Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Pengadu" required><UInput v-model="form.pengadu" placeholder="Nama pengadu" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
          <UFormField label="Penerangan" required><UInput v-model="form.penerangan" placeholder="Penerangan kerosakan" class="w-full" /></UFormField>
          <UFormField label="Lokasi"><UInput v-model="form.lokasi" placeholder="Lokasi kerosakan" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.pengadu || !form.kategori || !form.penerangan" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Aduan</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam aduan ini?</p>
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
