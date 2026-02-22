<script setup lang="ts">
definePageMeta({ title: 'Mesyuarat Dokumen' })
const toast = useToast()

const data = ref([
  { id: 1, tajuk: 'Mesyuarat Semakan Pengurusan (MSP) Bil. 1/2026', tarikh: '15/01/2026', bilAgenda: 8, kehadiran: '12/15', statusMinit: 'Diedarkan' },
  { id: 2, tajuk: 'Mesyuarat Jawatankuasa ISO Bil. 1/2026', tarikh: '28/01/2026', bilAgenda: 5, kehadiran: '8/10', statusMinit: 'Diedarkan' },
  { id: 3, tajuk: 'Mesyuarat Audit Dalaman Bil. 1/2026', tarikh: '10/02/2026', bilAgenda: 6, kehadiran: '6/8', statusMinit: 'Dalam Penyediaan' },
  { id: 4, tajuk: 'Mesyuarat Jawatankuasa ISO Bil. 2/2026', tarikh: '10/03/2026', bilAgenda: 0, kehadiran: '-', statusMinit: 'Belum Bermula' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'tajuk', header: 'Tajuk Mesyuarat' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'bilAgenda', header: 'Bil. Agenda' },
  { accessorKey: 'kehadiran', header: 'Kehadiran' },
  { accessorKey: 'statusMinit', header: 'Status Minit' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Diedarkan: 'success', 'Dalam Penyediaan': 'warning', 'Belum Bermula': 'neutral' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', tarikh: '', bilAgenda: 0, kehadiran: '-', statusMinit: 'Belum Bermula' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', tarikh: '', bilAgenda: 0, kehadiran: '-', statusMinit: 'Belum Bermula' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, tarikh: item.tarikh, bilAgenda: item.bilAgenda, kehadiran: item.kehadiran, statusMinit: item.statusMinit })
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
    toast.add({ title: 'Berjaya', description: 'Mesyuarat berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.statusMinit = status; toast.add({ title: 'Status Dikemaskini', description: `Minit ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Mesyuarat (Pengurusan Dokumen)</h2>
      <p class="text-sm text-gray-500">Pengurusan mesyuarat berkaitan sistem pengurusan kualiti</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari mesyuarat..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Mesyuarat Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #statusMinit-cell="{ row }">
          <UBadge :color="statusColour[row.original.statusMinit] ?? 'neutral'" variant="soft" size="sm">{{ row.original.statusMinit }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.statusMinit === 'Belum Bermula'" icon="i-lucide-play" color="info" variant="ghost" size="xs" title="Mula Penyediaan" @click="changeStatus(row.original.id, 'Dalam Penyediaan')" />
            <UButton v-if="row.original.statusMinit === 'Dalam Penyediaan'" icon="i-lucide-send" color="success" variant="ghost" size="xs" title="Edar Minit" @click="changeStatus(row.original.id, 'Diedarkan')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Mesyuarat' : 'Mesyuarat Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk mesyuarat" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Bil. Agenda"><UInput v-model="form.bilAgenda" type="number" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tambah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod mesyuarat ini?</p>
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
