<script setup lang="ts">
definePageMeta({ title: 'Pelantikan PPB' })
const toast = useToast()

const data = ref([
  { id: 1, noPPB: 'PPB-2025-001', nama: 'Dr. Ahmad Faisal', syarikat: 'Syarikat Atom Sdn Bhd', kategori: 'Kategori A', tarikhLantik: '01/01/2025', tarikhTamat: '31/12/2027', status: 'Aktif' },
  { id: 2, noPPB: 'PPB-2025-002', nama: 'Ir. Tan Soon Huat', syarikat: 'Radiasi Teknik Sdn Bhd', kategori: 'Kategori B', tarikhLantik: '15/03/2025', tarikhTamat: '14/03/2028', status: 'Aktif' },
  { id: 3, noPPB: 'PPB-2025-003', nama: 'Dr. Nurul Ain', syarikat: 'Perubatan Nuklear KL', kategori: 'Kategori A', tarikhLantik: '01/06/2025', tarikhTamat: '31/05/2028', status: 'Aktif' },
  { id: 4, noPPB: 'PPB-2023-045', nama: 'Mohd Rizal', syarikat: 'MediRad Diagnostik', kategori: 'Kategori B', tarikhLantik: '01/04/2023', tarikhTamat: '31/03/2026', status: 'Hampir Tamat' },
  { id: 5, noPPB: 'PPB-2026-001', nama: 'Lee Chong Wei', syarikat: 'SinarTech Engineering', kategori: 'Kategori B', tarikhLantik: '-', tarikhTamat: '-', status: 'Dalam Proses' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q) || d.noPPB.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'PPB Aktif', value: data.value.filter(d => d.status === 'Aktif').length, icon: 'i-lucide-user-check', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Dalam Proses', value: data.value.filter(d => d.status === 'Dalam Proses').length, icon: 'i-lucide-user-plus', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Hampir Tamat', value: data.value.filter(d => d.status === 'Hampir Tamat').length, icon: 'i-lucide-alert-triangle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noPPB', header: 'No. PPB' },
  { accessorKey: 'nama', header: 'Nama' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'kategori', header: 'Kategori' },
  { accessorKey: 'tarikhLantik', header: 'Tarikh Lantik' },
  { accessorKey: 'tarikhTamat', header: 'Tarikh Tamat' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', 'Hampir Tamat': 'error', 'Dalam Proses': 'warning' }
const kategoriOptions = ['Kategori A', 'Kategori B'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', syarikat: '', kategori: '', tarikhLantik: '', tarikhTamat: '', status: 'Dalam Proses' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', syarikat: '', kategori: '', tarikhLantik: '-', tarikhTamat: '-', status: 'Dalam Proses' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, syarikat: item.syarikat, kategori: item.kategori, tarikhLantik: item.tarikhLantik, tarikhTamat: item.tarikhTamat, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noPPB: `PPB-2026-${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Pelantikan PPB berjaya didaftarkan.', color: 'success' })
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
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pelantikan Pegawai Perlindungan Bahagian (PPB)</h2>
      <p class="text-sm text-gray-500">Pengurusan pelantikan dan rekod PPB</p>
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
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari PPB..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Lantik PPB Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Dalam Proses'" icon="i-lucide-check" color="success" variant="ghost" size="xs" title="Aktifkan" @click="changeStatus(row.original.id, 'Aktif')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting PPB' : 'Lantik PPB Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh Lantik"><UInput v-model="form.tarikhLantik" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Tarikh Tamat"><UInput v-model="form.tarikhTamat" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.syarikat || !form.kategori" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Lantik' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod PPB ini?</p>
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
