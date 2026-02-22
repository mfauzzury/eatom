<script setup lang="ts">
definePageMeta({ title: 'Outreach & Promosi' })
const toast = useToast()

const data = ref([
  { id: 1, program: 'Pameran Sains Nuklear 2026', jenis: 'Pameran', tarikh: '15-17/03/2026', lokasi: 'KLCC', peserta: '-', status: 'Akan Datang' },
  { id: 2, program: 'Program Kesedaran Radiasi - Sekolah', jenis: 'Ceramah', tarikh: '10/03/2026', lokasi: 'SM Sains Selangor', peserta: '-', status: 'Akan Datang' },
  { id: 3, program: 'Seminar Keselamatan Sinaran untuk Industri', jenis: 'Seminar', tarikh: '20/02/2026', lokasi: 'Hotel Putrajaya', peserta: '120', status: 'Selesai' },
  { id: 4, program: 'Lawatan Pelajar Universiti ke JTA', jenis: 'Lawatan', tarikh: '14/02/2026', lokasi: 'Pejabat JTA', peserta: '45', status: 'Selesai' },
  { id: 5, program: 'Kempen Media Sosial - Hari Sinaran Sedunia', jenis: 'Digital', tarikh: '08/11/2025', lokasi: 'Dalam Talian', peserta: '5,200', status: 'Selesai' },
  { id: 6, program: 'Bengkel Kewartawanan Sains', jenis: 'Bengkel', tarikh: '25/01/2026', lokasi: 'Dewan JTA', peserta: '35', status: 'Selesai' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.program.toLowerCase().includes(q) || d.jenis.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Program', value: data.value.length, icon: 'i-lucide-megaphone', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Selesai', value: data.value.filter(d => d.status === 'Selesai').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Akan Datang', value: data.value.filter(d => d.status === 'Akan Datang').length, icon: 'i-lucide-calendar', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'program', header: 'Nama Program' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'peserta', header: 'Peserta' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { 'Akan Datang': 'info', Selesai: 'success' }
const jenisOptions = ['Pameran', 'Ceramah', 'Seminar', 'Lawatan', 'Digital', 'Bengkel'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ program: '', jenis: '', tarikh: '', lokasi: '', peserta: '-', status: 'Akan Datang' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { program: '', jenis: '', tarikh: '', lokasi: '', peserta: '-', status: 'Akan Datang' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { program: item.program, jenis: item.jenis, tarikh: item.tarikh, lokasi: item.lokasi, peserta: item.peserta, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Program berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

// Record attendance
const showAttendanceModal = ref(false)
const attendanceId = ref(0)
const attendanceForm = reactive({ peserta: '' })
function openAttendance(item: typeof data.value[0]) { attendanceId.value = item.id; attendanceForm.peserta = ''; showAttendanceModal.value = true }
function saveAttendance() {
  const item = data.value.find(d => d.id === attendanceId.value)
  if (item) { item.peserta = attendanceForm.peserta; item.status = 'Selesai'; toast.add({ title: 'Rekod Peserta Disimpan', description: `${item.program}: ${attendanceForm.peserta} peserta`, color: 'success' }) }
  showAttendanceModal.value = false
}

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  colors: ['#8b5cf6'],
  xaxis: { categories: ['Pameran', 'Ceramah', 'Seminar', 'Lawatan', 'Digital', 'Bengkel'] },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const chartSeries = ref([{ name: 'Program', data: [2, 3, 2, 2, 1, 2] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Outreach & Promosi</h2>
      <p class="text-sm text-gray-500">Program jangkauan masyarakat dan promosi keselamatan sinaran</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
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
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari program..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Program" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Akan Datang'" icon="i-lucide-users" color="success" variant="ghost" size="xs" title="Rekod Peserta" @click="openAttendance(row.original)" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Program Mengikut Jenis</p></template>
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Program' : 'Daftar Program Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Program" required><UInput v-model="form.program" placeholder="Nama program" class="w-full" /></UFormField>
          <UFormField label="Jenis" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Lokasi"><UInput v-model="form.lokasi" placeholder="Lokasi" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.program || !form.jenis" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showAttendanceModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Rekod Peserta</h3></template>
        <UFormField label="Bilangan Peserta" required><UInput v-model="attendanceForm.peserta" type="number" placeholder="cth: 120" class="w-full" /></UFormField>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showAttendanceModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!attendanceForm.peserta" @click="saveAttendance">Simpan</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Program</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam program ini?</p>
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
