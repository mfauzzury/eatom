<script setup lang="ts">
definePageMeta({ title: 'Kawalan Fail' })
const toast = useToast()

const data = ref([
  { id: 1, noFail: 'JTA/BPP/100-1', tajuk: 'Fail Permohonan Lesen Am', bahagian: 'BPP', bilDokumen: 245, lokasi: 'Bilik Fail BPP - Rak A1', status: 'Aktif' },
  { id: 2, noFail: 'JTA/BPP/100-2', tajuk: 'Fail Kelulusan Lesen', bahagian: 'BPP', bilDokumen: 189, lokasi: 'Bilik Fail BPP - Rak A2', status: 'Aktif' },
  { id: 3, noFail: 'JTA/BKP/200-1', tajuk: 'Fail Kebenaran Import/Eksport', bahagian: 'BKP', bilDokumen: 78, lokasi: 'Bilik Fail BKP - Rak B1', status: 'Aktif' },
  { id: 4, noFail: 'JTA/BPR/300-1', tajuk: 'Fail Pemantauan Radiasi', bahagian: 'BPR', bilDokumen: 312, lokasi: 'Bilik Fail BPR - Rak C1', status: 'Aktif' },
  { id: 5, noFail: 'JTA/BPP/100-3', tajuk: 'Fail Kawalselia & Pemeriksaan', bahagian: 'BPP', bilDokumen: 156, lokasi: 'Bilik Fail BPP - Rak A3', status: 'Aktif' },
  { id: 6, noFail: 'JTA/ADM/400-1', tajuk: 'Fail Pentadbiran Am', bahagian: 'Pentadbiran', bilDokumen: 98, lokasi: 'Bilik Fail Admin - Rak D1', status: 'Arkib' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.noFail.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'noFail', header: 'No. Fail' },
  { accessorKey: 'tajuk', header: 'Tajuk Fail' },
  { accessorKey: 'bahagian', header: 'Bahagian' },
  { accessorKey: 'bilDokumen', header: 'Bil. Dokumen' },
  { accessorKey: 'lokasi', header: 'Lokasi Fizikal' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', Arkib: 'neutral' }
const bahagianOptions = ['BPP', 'BKP', 'BPR', 'Pentadbiran'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', bahagian: '', bilDokumen: 0, lokasi: '', status: 'Aktif' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', bahagian: '', bilDokumen: 0, lokasi: '', status: 'Aktif' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, bahagian: item.bahagian, bilDokumen: item.bilDokumen, lokasi: item.lokasi, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noFail: `JTA/${form.bahagian}/${maxId + 1}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Fail berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Fail ${status === 'Arkib' ? 'diarkibkan' : 'diaktifkan'}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Kawalan Fail</h2>
      <p class="text-sm text-gray-500">Pengurusan dan penjejakan fail fizikal organisasi</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari fail..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Fail Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Aktif'" icon="i-lucide-archive" color="neutral" variant="ghost" size="xs" title="Arkib" @click="changeStatus(row.original.id, 'Arkib')" />
            <UButton v-if="row.original.status === 'Arkib'" icon="i-lucide-undo" color="info" variant="ghost" size="xs" title="Aktifkan Semula" @click="changeStatus(row.original.id, 'Aktif')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Fail' : 'Daftar Fail Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk Fail" required><UInput v-model="form.tajuk" placeholder="Tajuk fail" class="w-full" /></UFormField>
          <UFormField label="Bahagian" required><USelect v-model="form.bahagian" :items="bahagianOptions" placeholder="Pilih bahagian" class="w-full" /></UFormField>
          <UFormField label="Lokasi Fizikal"><UInput v-model="form.lokasi" placeholder="cth: Bilik Fail BPP - Rak A1" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk || !form.bahagian" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Fail</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod fail ini?</p>
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
