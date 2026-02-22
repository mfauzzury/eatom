<script setup lang="ts">
definePageMeta({ title: 'Pengurusan Surat' })
const toast = useToast()

const data = ref([
  { id: 1, noSurat: 'JTA/BPP/100-3/1/2026(1)', tajuk: 'Kelulusan Lesen - Syarikat Atom', jenis: 'Keluar', penerima: 'Syarikat Atom Sdn Bhd', tarikh: '17/01/2026', status: 'Dihantar' },
  { id: 2, noSurat: 'JTA/BPP/100-3/1/2026(2)', tajuk: 'Notis Pemeriksaan Tapak', jenis: 'Keluar', penerima: 'Radiasi Teknik Sdn Bhd', tarikh: '20/01/2026', status: 'Dihantar' },
  { id: 3, noSurat: 'JTA/BKP/200-1/2026(3)', tajuk: 'Permohonan Import Sumber', jenis: 'Masuk', penerima: 'SinarTech Engineering', tarikh: '15/02/2026', status: 'Diterima' },
  { id: 4, noSurat: 'JTA/BPP/100-3/1/2026(4)', tajuk: 'Surat Penolakan - MediRad', jenis: 'Keluar', penerima: 'MediRad Diagnostik', tarikh: '18/02/2026', status: 'Draf' },
  { id: 5, noSurat: 'JTA/BPR/300-2/2026(1)', tajuk: 'Laporan Insiden Radiasi', jenis: 'Masuk', penerima: 'Gamma Industrial', tarikh: '10/02/2026', status: 'Diterima' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.penerima.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'noSurat', header: 'No. Surat' },
  { accessorKey: 'tajuk', header: 'Tajuk' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'penerima', header: 'Penerima/Pengirim' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Dihantar: 'success', Diterima: 'info', Draf: 'warning' }
const jenisOptions = ['Masuk', 'Keluar'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', jenis: '', penerima: '', tarikh: '', status: 'Draf' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', jenis: '', penerima: '', tarikh: new Date().toLocaleDateString('en-GB'), status: 'Draf' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, jenis: item.jenis, penerima: item.penerima, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noSurat: `JTA/2026/${maxId + 1}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Surat berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Surat ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pengurusan Surat</h2>
      <p class="text-sm text-gray-500">Pengurusan surat masuk dan keluar organisasi</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari surat..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Surat Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #jenis-cell="{ row }">
          <UBadge :color="row.original.jenis === 'Masuk' ? 'info' : 'neutral'" variant="soft" size="xs">{{ row.original.jenis }}</UBadge>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Draf'" icon="i-lucide-send" color="success" variant="ghost" size="xs" title="Hantar" @click="changeStatus(row.original.id, 'Dihantar')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Surat' : 'Daftar Surat Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk surat" class="w-full" /></UFormField>
          <UFormField label="Jenis" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Penerima/Pengirim" required><UInput v-model="form.penerima" placeholder="Nama penerima" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk || !form.jenis || !form.penerima" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Surat</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod surat ini?</p>
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
