<script setup lang="ts">
definePageMeta({ title: 'Pendaftaran Peperiksaan' })
const toast = useToast()

const data = ref([
  { id: 1, noPendaftaran: 'REG-2026-001', nama: 'Mohd Hafiz bin Razak', syarikat: 'Syarikat Atom Sdn Bhd', jenisPeperiksaan: 'PPB Asas', sesi: 'Mac 2026', status: 'Disahkan' },
  { id: 2, noPendaftaran: 'REG-2026-002', nama: 'Tan Mei Ling', syarikat: 'MediRad Diagnostik', jenisPeperiksaan: 'PPB Lanjutan', sesi: 'Mac 2026', status: 'Disahkan' },
  { id: 3, noPendaftaran: 'REG-2026-003', nama: 'Ravi a/l Kumar', syarikat: 'Gamma Industrial', jenisPeperiksaan: 'Pengendali Sinaran', sesi: 'Mac 2026', status: 'Menunggu' },
  { id: 4, noPendaftaran: 'REG-2026-004', nama: 'Aisyah binti Ahmad', syarikat: 'SinarTech Engineering', jenisPeperiksaan: 'PPB Asas', sesi: 'Jun 2026', status: 'Menunggu' },
  { id: 5, noPendaftaran: 'REG-2026-005', nama: 'Wong Jia Wei', syarikat: 'Isotop Malaysia Bhd', jenisPeperiksaan: 'PPB Asas', sesi: 'Jun 2026', status: 'Menunggu' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Calon Berdaftar', value: data.value.length, icon: 'i-lucide-user-plus', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Disahkan', value: data.value.filter(d => d.status === 'Disahkan').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Menunggu Pengesahan', value: data.value.filter(d => d.status === 'Menunggu').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'noPendaftaran', header: 'No. Pendaftaran' },
  { accessorKey: 'nama', header: 'Nama Calon' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'jenisPeperiksaan', header: 'Peperiksaan' },
  { accessorKey: 'sesi', header: 'Sesi' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Disahkan: 'success', Menunggu: 'warning', Ditolak: 'error' }
const jenisOptions = ['PPB Asas', 'PPB Lanjutan', 'Pengendali Sinaran'].map(v => ({ label: v, value: v }))
const sesiOptions = ['Mac 2026', 'Jun 2026', 'Sep 2026', 'Dis 2026'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', syarikat: '', jenisPeperiksaan: '', sesi: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', syarikat: '', jenisPeperiksaan: '', sesi: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, syarikat: item.syarikat, jenisPeperiksaan: item.jenisPeperiksaan, sesi: item.sesi, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noPendaftaran: `REG-2026-${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Calon berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Pendaftaran ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pendaftaran Peperiksaan</h2>
      <p class="text-sm text-gray-500">Pengurusan pendaftaran calon peperiksaan PPB dan pengendali sinaran</p>
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
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari calon..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Calon Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <template v-if="row.original.status === 'Menunggu'">
              <UButton icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Disahkan')" />
              <UButton icon="i-lucide-x" color="error" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Ditolak')" />
            </template>
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Pendaftaran' : 'Daftar Calon Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Calon" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <UFormField label="Jenis Peperiksaan" required><USelect v-model="form.jenisPeperiksaan" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Sesi" required><USelect v-model="form.sesi" :items="sesiOptions" placeholder="Pilih sesi" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.syarikat || !form.jenisPeperiksaan || !form.sesi" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam pendaftaran ini?</p>
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
