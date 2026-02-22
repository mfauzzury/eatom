<script setup lang="ts">
definePageMeta({ title: 'Permohonan Latihan' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Siti Semakan', kursus: 'Kursus Perlindungan Sinaran Lanjutan', penganjur: 'AELB', tarikh: '10-12/03/2026', kos: '1,500', status: 'Diluluskan' },
  { id: 2, nama: 'Kamal Ketua', kursus: 'Seminar Keselamatan Nuklear Antarabangsa', penganjur: 'IAEA', tarikh: '20-24/04/2026', kos: '8,500', status: 'Menunggu' },
  { id: 3, nama: 'Ahmad Admin', kursus: 'Latihan Pengurusan Sistem ICT', penganjur: 'INTAN', tarikh: '15-16/03/2026', kos: '800', status: 'Diluluskan' },
  { id: 4, nama: 'Siti Semakan', kursus: 'Bengkel QA/QC Pengukuran Radiasi', penganjur: 'SSDL Malaysia', tarikh: '05/03/2026', kos: '500', status: 'Diluluskan' },
  { id: 5, nama: 'Pengarah Penilaian', kursus: 'Leadership Development Programme', penganjur: 'JPA', tarikh: '01-05/06/2026', kos: '3,000', status: 'Menunggu' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.kursus.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Permohonan', value: data.value.length, icon: 'i-lucide-book-open', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Diluluskan', value: data.value.filter(d => d.status === 'Diluluskan').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Menunggu', value: data.value.filter(d => d.status === 'Menunggu').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Ditolak', value: data.value.filter(d => d.status === 'Ditolak').length, icon: 'i-lucide-x-circle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'nama', header: 'Nama Pegawai' },
  { accessorKey: 'kursus', header: 'Nama Kursus / Latihan' },
  { accessorKey: 'penganjur', header: 'Penganjur' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'kos', header: 'Kos (RM)' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Diluluskan: 'success', Menunggu: 'warning', Ditolak: 'error' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', kursus: '', penganjur: '', tarikh: '', kos: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', kursus: '', penganjur: '', tarikh: '', kos: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, kursus: item.kursus, penganjur: item.penganjur, tarikh: item.tarikh, kos: item.kos, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Permohonan latihan berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Permohonan ${status.toLowerCase()}.`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  colors: ['#3b82f6'],
  xaxis: { categories: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun'] },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const chartSeries = ref([{ name: 'Permohonan', data: [8, 6, 10, 5, 7, 6] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Permohonan Latihan</h2>
      <p class="text-sm text-gray-500">Pengurusan permohonan kursus dan latihan pegawai</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari nama atau kursus..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Mohon Latihan" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <template v-if="row.original.status === 'Menunggu'">
                  <UButton icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Diluluskan')" />
                  <UButton icon="i-lucide-x" color="error" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Ditolak')" />
                </template>
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Permohonan Bulanan</p></template>
        <ClientOnly>
          <apexchart type="bar" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[260px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Permohonan' : 'Mohon Latihan Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Pegawai" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Nama Kursus" required><UInput v-model="form.kursus" placeholder="Nama kursus / latihan" class="w-full" /></UFormField>
          <UFormField label="Penganjur"><UInput v-model="form.penganjur" placeholder="Nama penganjur" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Kos (RM)"><UInput v-model="form.kos" placeholder="cth: 1,500" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.kursus" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam permohonan ini?</p>
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
