<script setup lang="ts">
definePageMeta({ title: 'Pendaftaran Sumber Sinaran' })
const toast = useToast()

const data = ref([
  { id: 1, noSiri: 'SS-2025-0001', jenisSumber: 'Sealed Source', nuklida: 'Cs-137', aktiviti: '3.7', lokasi: 'Hospital Serdang', pemilik: 'Syarikat Atom Sdn Bhd', status: 'Aktif' },
  { id: 2, noSiri: 'SS-2025-0002', jenisSumber: 'X-Ray Generator', nuklida: '-', aktiviti: '-', lokasi: 'Klinik PNK, KL', pemilik: 'Perubatan Nuklear KL', status: 'Aktif' },
  { id: 3, noSiri: 'SS-2025-0003', jenisSumber: 'Sealed Source', nuklida: 'Co-60', aktiviti: '185.0', lokasi: 'Kilang Gebeng', pemilik: 'Radiasi Teknik Sdn Bhd', status: 'Aktif' },
  { id: 4, noSiri: 'SS-2025-0004', jenisSumber: 'Sealed Source', nuklida: 'Ir-192', aktiviti: '1.85', lokasi: 'Kompleks Senai', pemilik: 'Gamma Industrial Services', status: 'Menunggu' },
  { id: 5, noSiri: 'SS-2025-0005', jenisSumber: 'Linear Accelerator', nuklida: '-', aktiviti: '-', lokasi: 'MediRad Centre, Penang', pemilik: 'MediRad Diagnostik', status: 'Aktif' },
  { id: 6, noSiri: 'SS-2024-0198', jenisSumber: 'Sealed Source', nuklida: 'Am-241', aktiviti: '0.37', lokasi: 'Makmal Isotop, Cyberjaya', pemilik: 'Isotop Malaysia Bhd', status: 'Tamat Tempoh' },
  { id: 7, noSiri: 'SS-2024-0145', jenisSumber: 'X-Ray Generator', nuklida: '-', aktiviti: '-', lokasi: 'Klinik Butterworth', pemilik: 'MediRad Diagnostik', status: 'Aktif' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.noSiri.toLowerCase().includes(q) || d.pemilik.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Sumber Berdaftar', value: data.value.length, icon: 'i-lucide-database', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Aktif', value: data.value.filter(d => d.status === 'Aktif').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Menunggu Pengesahan', value: data.value.filter(d => d.status === 'Menunggu').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Tamat Tempoh', value: data.value.filter(d => d.status === 'Tamat Tempoh').length, icon: 'i-lucide-alert-triangle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noSiri', header: 'No. Siri' },
  { accessorKey: 'jenisSumber', header: 'Jenis Sumber' },
  { accessorKey: 'nuklida', header: 'Nuklida' },
  { accessorKey: 'aktiviti', header: 'Aktiviti (GBq)' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'pemilik', header: 'Pemilik' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Aktif: 'success', Menunggu: 'warning', 'Tamat Tempoh': 'error' }
const jenisSumberOptions = ['Sealed Source', 'X-Ray Generator', 'Linear Accelerator', 'Lain-lain'].map(v => ({ label: v, value: v }))
const statusOptions = ['Menunggu', 'Aktif', 'Tamat Tempoh'].map(v => ({ label: v, value: v }))

// Modal
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ jenisSumber: '', nuklida: '', aktiviti: '', lokasi: '', pemilik: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { jenisSumber: '', nuklida: '', aktiviti: '', lokasi: '', pemilik: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true
  editId.value = item.id
  Object.assign(form, { jenisSumber: item.jenisSumber, nuklida: item.nuklida, aktiviti: item.aktiviti, lokasi: item.lokasi, pemilik: item.pemilik, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', description: 'Rekod sumber berjaya dikemaskini.', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noSiri: `SS-2026-${String(maxId + 1).padStart(4, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Sumber sinaran berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

// Delete
const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() {
  data.value = data.value.filter(d => d.id !== deleteId.value)
  showDelete.value = false
  toast.add({ title: 'Dipadam', description: 'Rekod sumber berjaya dipadam.', color: 'success' })
}

// Status change
function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Status ditukar kepada ${status}.`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'pie' as const, height: 260 },
  labels: ['Sealed Source', 'X-Ray Generator', 'Linear Accelerator', 'Lain-lain'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  legend: { position: 'bottom' as const, fontSize: '11px' },
  dataLabels: { enabled: true, formatter: (val: number) => val.toFixed(0) + '%' }
}))
const chartSeries = computed(() => {
  const counts = { 'Sealed Source': 0, 'X-Ray Generator': 0, 'Linear Accelerator': 0, 'Lain-lain': 0 }
  data.value.forEach(d => { if (d.jenisSumber in counts) (counts as Record<string, number>)[d.jenisSumber]++; else counts['Lain-lain']++ })
  return Object.values(counts)
})
</script>

<template>
  <div>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pendaftaran Sumber Sinaran</h2>
      <p class="text-sm text-gray-500">Pengurusan pendaftaran sumber sinaran mengion dan peralatan</p>
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
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Baru" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Menunggu'" icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Aktif')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Jenis Sumber</p></template>
        <ClientOnly>
          <apexchart type="pie" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-65 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Sumber' : 'Daftar Sumber Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Jenis Sumber" required><USelect v-model="form.jenisSumber" :items="jenisSumberOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Nuklida"><UInput v-model="form.nuklida" placeholder="cth: Cs-137" class="w-full" /></UFormField>
          <UFormField label="Aktiviti (GBq)"><UInput v-model="form.aktiviti" placeholder="cth: 3.7" class="w-full" /></UFormField>
          <UFormField label="Lokasi" required><UInput v-model="form.lokasi" placeholder="Lokasi peralatan" class="w-full" /></UFormField>
          <UFormField label="Pemilik" required><UInput v-model="form.pemilik" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <UFormField v-if="isEdit" label="Status"><USelect v-model="form.status" :items="statusOptions" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.jenisSumber || !form.lokasi || !form.pemilik" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod sumber ini?</p>
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
