<script setup lang="ts">
definePageMeta({ title: 'Kawalselia' })
const toast = useToast()

const data = ref([
  { id: 1, noLaporan: 'KS-2026-001', syarikat: 'Syarikat Atom Sdn Bhd', jenisPemeriksaan: 'Pemeriksaan Rutin', tarikhPemeriksaan: '10/01/2026', pegawai: 'Siti Semakan', status: 'Patuh' },
  { id: 2, noLaporan: 'KS-2026-002', syarikat: 'Radiasi Teknik Sdn Bhd', jenisPemeriksaan: 'Pemeriksaan Khas', tarikhPemeriksaan: '15/01/2026', pegawai: 'Kamal Ketua', status: 'Tidak Patuh' },
  { id: 3, noLaporan: 'KS-2026-003', syarikat: 'Perubatan Nuklear KL', jenisPemeriksaan: 'Pemeriksaan Rutin', tarikhPemeriksaan: '22/01/2026', pegawai: 'Siti Semakan', status: 'Patuh' },
  { id: 4, noLaporan: 'KS-2026-004', syarikat: 'Gamma Industrial', jenisPemeriksaan: 'Pemeriksaan Tapak', tarikhPemeriksaan: '05/02/2026', pegawai: 'Kamal Ketua', status: 'Patuh' },
  { id: 5, noLaporan: 'KS-2026-005', syarikat: 'MediRad Diagnostik', jenisPemeriksaan: 'Pemeriksaan Rutin', tarikhPemeriksaan: '28/02/2026', pegawai: 'Siti Semakan', status: 'Dijadualkan' },
  { id: 6, noLaporan: 'KS-2026-006', syarikat: 'SinarTech Engineering', jenisPemeriksaan: 'Pemeriksaan Khas', tarikhPemeriksaan: '10/03/2026', pegawai: 'Kamal Ketua', status: 'Dijadualkan' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.noLaporan.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Pemeriksaan', value: data.value.length, icon: 'i-lucide-clipboard-check', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Patuh', value: data.value.filter(d => d.status === 'Patuh').length, icon: 'i-lucide-shield-check', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Tidak Patuh', value: data.value.filter(d => d.status === 'Tidak Patuh').length, icon: 'i-lucide-shield-alert', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Dijadualkan', value: data.value.filter(d => d.status === 'Dijadualkan').length, icon: 'i-lucide-calendar', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'noLaporan', header: 'No. Laporan' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'jenisPemeriksaan', header: 'Jenis' },
  { accessorKey: 'tarikhPemeriksaan', header: 'Tarikh' },
  { accessorKey: 'pegawai', header: 'Pegawai' },
  { accessorKey: 'status', header: 'Keputusan' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Patuh: 'success', 'Tidak Patuh': 'error', Dijadualkan: 'warning' }
const jenisOptions = ['Pemeriksaan Rutin', 'Pemeriksaan Khas', 'Pemeriksaan Tapak'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ syarikat: '', jenisPemeriksaan: '', tarikhPemeriksaan: '', pegawai: '', status: 'Dijadualkan' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { syarikat: '', jenisPemeriksaan: '', tarikhPemeriksaan: '', pegawai: '', status: 'Dijadualkan' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { syarikat: item.syarikat, jenisPemeriksaan: item.jenisPemeriksaan, tarikhPemeriksaan: item.tarikhPemeriksaan, pegawai: item.pegawai, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noLaporan: `KS-2026-${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Pemeriksaan berjaya dijadualkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Keputusan Direkodkan', description: `Pemeriksaan ${item.noLaporan}: ${status}`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 280, stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  colors: ['#10b981', '#ef4444', '#f59e0b'],
  xaxis: { categories: ['Sep', 'Okt', 'Nov', 'Dis', 'Jan', 'Feb'] },
  legend: { position: 'top' as const, fontSize: '11px' },
  dataLabels: { enabled: false }
}))
const chartSeries = ref([
  { name: 'Patuh', data: [12, 14, 10, 13, 12, 11] },
  { name: 'Tidak Patuh', data: [2, 1, 3, 2, 1, 2] },
  { name: 'Dijadualkan', data: [0, 0, 0, 0, 3, 3] }
])
</script>

<template>
  <div>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Kawalselia</h2>
      <p class="text-sm text-gray-500">Pemeriksaan pematuhan dan kawalselia premis sinaran</p>
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

    <UCard>
      <template #header><p class="text-sm font-semibold text-gray-700">Trend Pemeriksaan (6 Bulan)</p></template>
      <ClientOnly>
        <apexchart type="bar" height="280" :options="chartOptions" :series="chartSeries" />
        <template #fallback><div class="h-70 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
      </ClientOnly>
    </UCard>

    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jadual Pemeriksaan" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <template v-if="row.original.status === 'Dijadualkan'">
              <UButton icon="i-lucide-shield-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Patuh')" />
              <UButton icon="i-lucide-shield-alert" color="error" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Tidak Patuh')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Pemeriksaan' : 'Jadual Pemeriksaan Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <UFormField label="Jenis Pemeriksaan" required><USelect v-model="form.jenisPemeriksaan" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikhPemeriksaan" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          <UFormField label="Pegawai"><UInput v-model="form.pegawai" placeholder="Nama pegawai" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.syarikat || !form.jenisPemeriksaan" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Jadualkan' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod pemeriksaan ini?</p>
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
