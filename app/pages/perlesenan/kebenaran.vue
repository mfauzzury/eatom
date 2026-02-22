<script setup lang="ts">
definePageMeta({ title: 'Kebenaran' })
const toast = useToast()

const data = ref([
  { id: 1, noKebenaran: 'KB-2025-001', jenisKebenaran: 'Import Sumber', syarikat: 'Syarikat Atom Sdn Bhd', tarikhMula: '01/01/2025', tarikhTamat: '31/12/2025', status: 'Aktif' },
  { id: 2, noKebenaran: 'KB-2025-002', jenisKebenaran: 'Eksport Sumber', syarikat: 'Radiasi Teknik Sdn Bhd', tarikhMula: '15/02/2025', tarikhTamat: '14/02/2026', status: 'Aktif' },
  { id: 3, noKebenaran: 'KB-2025-003', jenisKebenaran: 'Transit Bahan Radioaktif', syarikat: 'Gamma Industrial', tarikhMula: '01/03/2025', tarikhTamat: '28/02/2026', status: 'Aktif' },
  { id: 4, noKebenaran: 'KB-2025-004', jenisKebenaran: 'Pengangkutan', syarikat: 'SinarTech Engineering', tarikhMula: '-', tarikhTamat: '-', status: 'Dalam Proses' },
  { id: 5, noKebenaran: 'KB-2024-089', jenisKebenaran: 'Import Sumber', syarikat: 'MediRad Diagnostik', tarikhMula: '01/06/2024', tarikhTamat: '31/05/2025', status: 'Hampir Tamat' },
  { id: 6, noKebenaran: 'KB-2025-005', jenisKebenaran: 'Pelupusan Sumber', syarikat: 'Isotop Malaysia Bhd', tarikhMula: '-', tarikhTamat: '-', status: 'Permohonan Baru' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.noKebenaran.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Kebenaran Aktif', value: data.value.filter(d => d.status === 'Aktif').length, icon: 'i-lucide-stamp', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Permohonan Baru', value: data.value.filter(d => d.status === 'Permohonan Baru').length, icon: 'i-lucide-file-plus', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Dalam Proses', value: data.value.filter(d => d.status === 'Dalam Proses').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Hampir Tamat', value: data.value.filter(d => d.status === 'Hampir Tamat').length, icon: 'i-lucide-alert-triangle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noKebenaran', header: 'No. Kebenaran' },
  { accessorKey: 'jenisKebenaran', header: 'Jenis' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'tarikhMula', header: 'Tarikh Mula' },
  { accessorKey: 'tarikhTamat', header: 'Tarikh Tamat' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', 'Dalam Proses': 'warning', 'Hampir Tamat': 'error', 'Permohonan Baru': 'info' }
const jenisOptions = ['Import Sumber', 'Eksport Sumber', 'Transit Bahan Radioaktif', 'Pengangkutan', 'Pelupusan Sumber'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ jenisKebenaran: '', syarikat: '', tarikhMula: '', tarikhTamat: '', status: 'Permohonan Baru' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { jenisKebenaran: '', syarikat: '', tarikhMula: '', tarikhTamat: '', status: 'Permohonan Baru' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { jenisKebenaran: item.jenisKebenaran, syarikat: item.syarikat, tarikhMula: item.tarikhMula, tarikhTamat: item.tarikhTamat, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noKebenaran: `KB-2026-${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Permohonan kebenaran berjaya didaftarkan.', color: 'success' })
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
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  colors: ['#6366f1'],
  xaxis: { categories: ['Import', 'Eksport', 'Transit', 'Pengangkutan', 'Pelupusan'] },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const chartSeries = ref([{ name: 'Kebenaran', data: [14, 8, 5, 4, 3] }])
</script>

<template>
  <div>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Kebenaran</h2>
      <p class="text-sm text-gray-500">Pengurusan kebenaran import, eksport, transit dan pengangkutan bahan radioaktif</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div>
            <p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Permohonan Baru" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Permohonan Baru'" icon="i-lucide-play" color="info" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Dalam Proses')" />
                <UButton v-if="row.original.status === 'Dalam Proses'" icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Aktif')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Kebenaran Mengikut Jenis</p></template>
        <ClientOnly>
          <apexchart type="bar" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-65 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Kebenaran' : 'Permohonan Kebenaran Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Jenis Kebenaran" required><USelect v-model="form.jenisKebenaran" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh Mula"><UInput v-model="form.tarikhMula" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Tarikh Tamat"><UInput v-model="form.tarikhTamat" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.jenisKebenaran || !form.syarikat" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod kebenaran ini?</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showDelete = false">Batal</UButton>
            <UButton color="error" @click="doDelete">Padam</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
  </div>
</template>
