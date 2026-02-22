<script setup lang="ts">
definePageMeta({ title: 'Tempahan Kenderaan' })
const toast = useToast()

const data = ref([
  { id: 1, noTempahan: 'TK-2026-045', pemohon: 'Siti Semakan', kenderaan: 'Toyota Hilux (JTA 1234)', destinasi: 'Gebeng, Pahang - Pemeriksaan Tapak', tarikh: '25/02/2026', status: 'Disahkan' },
  { id: 2, noTempahan: 'TK-2026-046', pemohon: 'Kamal Ketua', kenderaan: 'Toyota Innova (JTA 5678)', destinasi: 'Senai, Johor - Mesyuarat', tarikh: '26/02/2026', status: 'Disahkan' },
  { id: 3, noTempahan: 'TK-2026-047', pemohon: 'Nurul Hafizah', kenderaan: 'Proton X70 (JTA 9012)', destinasi: 'Georgetown, Pulau Pinang - Persampelan', tarikh: '01/03/2026', status: 'Menunggu' },
  { id: 4, noTempahan: 'TK-2026-044', pemohon: 'Ahmad Admin', kenderaan: 'Toyota Hilux (JTA 1234)', destinasi: 'Bangi - Hantar Peralatan', tarikh: '22/02/2026', status: 'Selesai' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.pemohon.toLowerCase().includes(q) || d.destinasi.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'noTempahan', header: 'No. Tempahan' },
  { accessorKey: 'pemohon', header: 'Pemohon' },
  { accessorKey: 'kenderaan', header: 'Kenderaan' },
  { accessorKey: 'destinasi', header: 'Destinasi' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Disahkan: 'success', Menunggu: 'warning', Selesai: 'neutral' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ pemohon: '', kenderaan: '', destinasi: '', tarikh: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { pemohon: '', kenderaan: '', destinasi: '', tarikh: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { pemohon: item.pemohon, kenderaan: item.kenderaan, destinasi: item.destinasi, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noTempahan: `TK-2026-${String(47 + maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Tempahan kenderaan berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Tempahan ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Tempahan Kenderaan</h2>
      <p class="text-sm text-gray-500">Sistem tempahan kenderaan rasmi jabatan</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari tempahan..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Tempah Kenderaan" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Menunggu'" icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Disahkan')" />
            <UButton v-if="row.original.status === 'Disahkan'" icon="i-lucide-check-check" color="neutral" variant="ghost" size="xs" title="Selesai" @click="changeStatus(row.original.id, 'Selesai')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Tempahan' : 'Tempah Kenderaan' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Pemohon" required><UInput v-model="form.pemohon" placeholder="Nama pemohon" class="w-full" /></UFormField>
          <UFormField label="Kenderaan"><UInput v-model="form.kenderaan" placeholder="cth: Toyota Hilux (JTA 1234)" class="w-full" /></UFormField>
          <UFormField label="Destinasi" required><UInput v-model="form.destinasi" placeholder="Destinasi perjalanan" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.pemohon || !form.destinasi" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tempah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Tempahan</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam tempahan ini?</p>
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
