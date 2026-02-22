<script setup lang="ts">
definePageMeta({ title: 'Dokumen ISO' })
const toast = useToast()

const data = ref([
  { id: 1, noDoc: 'QMS-MAN-001', tajuk: 'Manual Kualiti ISO 9001:2015', jenis: 'Manual', versi: 'Rev. 5', tarikhSemakan: '01/01/2026', status: 'Berkuatkuasa' },
  { id: 2, noDoc: 'QMS-PRO-001', tajuk: 'Prosedur Kawalan Dokumen', jenis: 'Prosedur', versi: 'Rev. 3', tarikhSemakan: '15/12/2025', status: 'Berkuatkuasa' },
  { id: 3, noDoc: 'QMS-PRO-002', tajuk: 'Prosedur Audit Dalaman', jenis: 'Prosedur', versi: 'Rev. 4', tarikhSemakan: '01/01/2026', status: 'Berkuatkuasa' },
  { id: 4, noDoc: 'QMS-PRO-003', tajuk: 'Prosedur Tindakan Pembetulan', jenis: 'Prosedur', versi: 'Rev. 2', tarikhSemakan: '10/11/2025', status: 'Berkuatkuasa' },
  { id: 5, noDoc: 'QMS-WI-001', tajuk: 'Arahan Kerja Pemprosesan Lesen', jenis: 'Arahan Kerja', versi: 'Rev. 6', tarikhSemakan: '20/01/2026', status: 'Berkuatkuasa' },
  { id: 6, noDoc: 'QMS-WI-002', tajuk: 'Arahan Kerja Pemeriksaan Tapak', jenis: 'Arahan Kerja', versi: 'Rev. 3', tarikhSemakan: '05/02/2026', status: 'Dalam Semakan' },
  { id: 7, noDoc: 'QMS-FRM-001', tajuk: 'Borang Semakan Permohonan', jenis: 'Borang', versi: 'Rev. 8', tarikhSemakan: '01/02/2026', status: 'Berkuatkuasa' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.noDoc.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'noDoc', header: 'No. Dokumen' },
  { accessorKey: 'tajuk', header: 'Tajuk' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'versi', header: 'Versi' },
  { accessorKey: 'tarikhSemakan', header: 'Tarikh Semakan' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Berkuatkuasa: 'success', 'Dalam Semakan': 'warning', Batal: 'error' }
const jenisOptions = ['Manual', 'Prosedur', 'Arahan Kerja', 'Borang'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ noDoc: '', tajuk: '', jenis: '', versi: '', tarikhSemakan: '', status: 'Dalam Semakan' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { noDoc: '', tajuk: '', jenis: '', versi: 'Rev. 1', tarikhSemakan: new Date().toLocaleDateString('en-GB'), status: 'Dalam Semakan' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { noDoc: item.noDoc, tajuk: item.tajuk, jenis: item.jenis, versi: item.versi, tarikhSemakan: item.tarikhSemakan, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Dokumen ISO berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Dokumen ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Dokumen ISO</h2>
      <p class="text-sm text-gray-500">Sistem pengurusan kualiti ISO 9001 - kawalan dokumen</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari dokumen ISO..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Dokumen ISO" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Dalam Semakan'" icon="i-lucide-check" color="success" variant="ghost" size="xs" title="Kuatkuasakan" @click="changeStatus(row.original.id, 'Berkuatkuasa')" />
            <UButton v-if="row.original.status === 'Berkuatkuasa'" icon="i-lucide-x" color="error" variant="ghost" size="xs" title="Batalkan" @click="changeStatus(row.original.id, 'Batal')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Dokumen ISO' : 'Daftar Dokumen ISO Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="No. Dokumen" required><UInput v-model="form.noDoc" placeholder="cth: QMS-PRO-004" class="w-full" /></UFormField>
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk dokumen" class="w-full" /></UFormField>
          <UFormField label="Jenis" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Versi"><UInput v-model="form.versi" placeholder="cth: Rev. 1" class="w-full" /></UFormField>
            <UFormField label="Tarikh Semakan"><UInput v-model="form.tarikhSemakan" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.noDoc || !form.tajuk || !form.jenis" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Dokumen</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam dokumen ISO ini?</p>
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
