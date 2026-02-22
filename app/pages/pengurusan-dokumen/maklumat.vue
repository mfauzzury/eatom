<script setup lang="ts">
definePageMeta({ title: 'Maklumat Dokumen' })
const toast = useToast()

const data = ref([
  { id: 1, noRujukan: 'DOK/BPP/2026/001', tajuk: 'Laporan Tahunan Perlesenan 2025', kategori: 'Laporan', tarikh: '15/01/2026', pemilik: 'BPP', status: 'Aktif' },
  { id: 2, noRujukan: 'DOK/BPP/2026/002', tajuk: 'Minit Mesyuarat Perlesenan Bil. 1/2026', kategori: 'Minit', tarikh: '08/02/2026', pemilik: 'BPP', status: 'Aktif' },
  { id: 3, noRujukan: 'DOK/BKP/2026/015', tajuk: 'Surat Kelulusan Lesen PL/2025/0001', kategori: 'Surat Rasmi', tarikh: '17/01/2026', pemilik: 'BKP', status: 'Aktif' },
  { id: 4, noRujukan: 'DOK/BPP/2026/003', tajuk: 'Draf Garis Panduan Baharu', kategori: 'Panduan', tarikh: '20/02/2026', pemilik: 'BPP', status: 'Draf' },
  { id: 5, noRujukan: 'DOK/BPR/2026/008', tajuk: 'Laporan Pemantauan Radiasi Jan 2026', kategori: 'Laporan', tarikh: '05/02/2026', pemilik: 'BPR', status: 'Aktif' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.noRujukan.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Dokumen', value: data.value.length, icon: 'i-lucide-files', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Aktif', value: data.value.filter(d => d.status === 'Aktif').length, icon: 'i-lucide-file-check', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Draf', value: data.value.filter(d => d.status === 'Draf').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Arkib', value: data.value.filter(d => d.status === 'Arkib').length, icon: 'i-lucide-archive', color: 'text-gray-600', bg: 'bg-gray-50' }
])

const columns = [
  { accessorKey: 'noRujukan', header: 'No. Rujukan' },
  { accessorKey: 'tajuk', header: 'Tajuk' },
  { accessorKey: 'kategori', header: 'Kategori' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'pemilik', header: 'Pemilik' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', Draf: 'warning', Arkib: 'neutral' }
const kategoriOptions = ['Laporan', 'Surat Rasmi', 'Minit', 'Panduan', 'Pekeliling', 'Lain-lain'].map(v => ({ label: v, value: v }))
const pemilikOptions = ['BPP', 'BKP', 'BPR'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', kategori: '', tarikh: '', pemilik: '', status: 'Draf' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', kategori: '', tarikh: new Date().toLocaleDateString('en-GB'), pemilik: '', status: 'Draf' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, kategori: item.kategori, tarikh: item.tarikh, pemilik: item.pemilik, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noRujukan: `DOK/${form.pemilik}/2026/${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Dokumen berjaya didaftarkan.', color: 'success' })
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
  chart: { type: 'pie' as const, height: 260 },
  labels: ['Laporan', 'Surat Rasmi', 'Minit', 'Panduan', 'Pekeliling', 'Lain-lain'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'],
  legend: { position: 'bottom' as const, fontSize: '11px' }
}))
const chartSeries = ref([345, 289, 198, 156, 134, 125])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Maklumat Dokumen</h2>
      <p class="text-sm text-gray-500">Sistem pengurusan dokumen rasmi organisasi</p>
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
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari dokumen..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Dokumen" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Draf'" icon="i-lucide-check" color="success" variant="ghost" size="xs" title="Aktifkan" @click="changeStatus(row.original.id, 'Aktif')" />
                <UButton v-if="row.original.status === 'Aktif'" icon="i-lucide-archive" color="neutral" variant="ghost" size="xs" title="Arkib" @click="changeStatus(row.original.id, 'Arkib')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Kategori</p></template>
        <ClientOnly>
          <apexchart type="pie" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[260px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Dokumen' : 'Daftar Dokumen Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk dokumen" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
          <UFormField label="Pemilik" required><USelect v-model="form.pemilik" :items="pemilikOptions" placeholder="Pilih bahagian" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk || !form.kategori || !form.pemilik" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Dokumen</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam dokumen ini?</p>
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
