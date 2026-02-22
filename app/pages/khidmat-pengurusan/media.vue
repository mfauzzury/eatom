<script setup lang="ts">
definePageMeta({ title: 'Media Kreatif' })
const toast = useToast()

const data = ref([
  { id: 1, noPermohonan: 'MK-2026-014', pemohon: 'BPP', jenis: 'Banner', tajuk: 'Banner Hari Kualiti 2026', tarikhPerlu: '01/03/2026', status: 'Dalam Proses' },
  { id: 2, noPermohonan: 'MK-2026-013', pemohon: 'BPR', jenis: 'Infografik', tajuk: 'Infografik Keselamatan Sinaran', tarikhPerlu: '28/02/2026', status: 'Dalam Proses' },
  { id: 3, noPermohonan: 'MK-2026-012', pemohon: 'Pengarah', jenis: 'Video', tajuk: 'Video Korporat JTA 2026', tarikhPerlu: '15/03/2026', status: 'Dalam Proses' },
  { id: 4, noPermohonan: 'MK-2026-011', pemohon: 'BPP', jenis: 'Brosur', tajuk: 'Brosur Panduan Permohonan Lesen', tarikhPerlu: '15/02/2026', status: 'Selesai' },
  { id: 5, noPermohonan: 'MK-2026-010', pemohon: 'Pentadbiran', jenis: 'Poster', tajuk: 'Poster Keselamatan Pejabat', tarikhPerlu: '10/02/2026', status: 'Selesai' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.pemohon.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Projek Aktif', value: data.value.filter(d => d.status === 'Dalam Proses' || d.status === 'Baru').length, icon: 'i-lucide-palette', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Selesai', value: data.value.filter(d => d.status === 'Selesai').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Jumlah', value: data.value.length, icon: 'i-lucide-file-plus', color: 'text-blue-600', bg: 'bg-blue-50' }
])

const columns = [
  { accessorKey: 'noPermohonan', header: 'No. Permohonan' },
  { accessorKey: 'pemohon', header: 'Pemohon' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'tajuk', header: 'Tajuk/Penerangan' },
  { accessorKey: 'tarikhPerlu', header: 'Tarikh Perlu' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { 'Dalam Proses': 'warning', Selesai: 'success', Baru: 'info' }
const jenisOptions = ['Banner', 'Infografik', 'Video', 'Brosur', 'Poster'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ pemohon: '', jenis: '', tajuk: '', tarikhPerlu: '', status: 'Baru' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { pemohon: '', jenis: '', tajuk: '', tarikhPerlu: '', status: 'Baru' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { pemohon: item.pemohon, jenis: item.jenis, tajuk: item.tajuk, tarikhPerlu: item.tarikhPerlu, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noPermohonan: `MK-2026-${String(14 + maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Permohonan media berjaya dihantar.', color: 'success' })
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
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Media Kreatif</h2>
      <p class="text-sm text-gray-500">Permohonan reka bentuk grafik, video dan bahan kreatif</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari permohonan..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Permohonan Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Baru'" icon="i-lucide-play" color="info" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Dalam Proses')" />
            <UButton v-if="row.original.status === 'Dalam Proses'" icon="i-lucide-check-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Selesai')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Permohonan' : 'Permohonan Media Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Pemohon" required><UInput v-model="form.pemohon" placeholder="Bahagian/Nama" class="w-full" /></UFormField>
          <UFormField label="Jenis" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Tajuk/Penerangan" required><UInput v-model="form.tajuk" placeholder="Penerangan ringkas" class="w-full" /></UFormField>
          <UFormField label="Tarikh Perlu"><UInput v-model="form.tarikhPerlu" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.pemohon || !form.jenis || !form.tajuk" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
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
