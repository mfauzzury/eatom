<script setup lang="ts">
definePageMeta({ title: 'Rekod Latihan' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Siti Semakan', jawatan: 'Pegawai Semakan', jumlahKursus: 12, jamLatihan: 96, terakhir: 'Perlindungan Sinaran Lanjutan', tarikhTerakhir: '12/03/2026' },
  { id: 2, nama: 'Kamal Ketua', jawatan: 'Ketua Unit', jumlahKursus: 15, jamLatihan: 124, terakhir: 'Leadership Programme', tarikhTerakhir: '05/06/2026' },
  { id: 3, nama: 'Ahmad Admin', jawatan: 'Pentadbir Sistem', jumlahKursus: 8, jamLatihan: 64, terakhir: 'Pengurusan Sistem ICT', tarikhTerakhir: '16/03/2026' },
  { id: 4, nama: 'Pengarah Penilaian', jawatan: 'Pengarah', jumlahKursus: 18, jamLatihan: 156, terakhir: 'International Nuclear Safety', tarikhTerakhir: '24/04/2026' },
  { id: 5, nama: 'Nurul Hafizah', jawatan: 'Pegawai Sains', jumlahKursus: 6, jamLatihan: 48, terakhir: 'Dosimetri Persekitaran', tarikhTerakhir: '20/01/2026' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.jawatan.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'nama', header: 'Nama Pegawai' },
  { accessorKey: 'jawatan', header: 'Jawatan' },
  { accessorKey: 'jumlahKursus', header: 'Kursus Hadir' },
  { accessorKey: 'jamLatihan', header: 'Jam Latihan' },
  { accessorKey: 'terakhir', header: 'Kursus Terakhir' },
  { accessorKey: 'tarikhTerakhir', header: 'Tarikh' },
  { id: 'actions', header: '' }
]

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', jawatan: '', jumlahKursus: 0, jamLatihan: 0, terakhir: '', tarikhTerakhir: '' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', jawatan: '', jumlahKursus: 0, jamLatihan: 0, terakhir: '', tarikhTerakhir: '' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, jawatan: item.jawatan, jumlahKursus: item.jumlahKursus, jamLatihan: item.jamLatihan, terakhir: item.terakhir, tarikhTerakhir: item.tarikhTerakhir })
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
    toast.add({ title: 'Berjaya', description: 'Rekod latihan berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

const chartOptions = computed(() => ({
  chart: { type: 'radar' as const, height: 300, toolbar: { show: false } },
  xaxis: { categories: ['Perlindungan Sinaran', 'Pengurusan', 'Teknikal', 'ICT', 'Kepimpinan', 'Keselamatan'] },
  colors: ['#3b82f6'],
  markers: { size: 4 },
  fill: { opacity: 0.2 }
}))
const chartSeries = ref([{ name: 'Jam Latihan', data: [35, 22, 28, 18, 15, 20] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Rekod Latihan</h2>
      <p class="text-sm text-gray-500">Rekod kehadiran kursus dan jam latihan pegawai</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari nama atau jawatan..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Tambah Rekod" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Kategori Latihan</p></template>
        <ClientOnly>
          <apexchart type="radar" height="300" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[300px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Rekod' : 'Tambah Rekod Latihan' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Pegawai" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Jawatan"><UInput v-model="form.jawatan" placeholder="Jawatan" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Jumlah Kursus"><UInput v-model="form.jumlahKursus" type="number" class="w-full" /></UFormField>
            <UFormField label="Jam Latihan"><UInput v-model="form.jamLatihan" type="number" class="w-full" /></UFormField>
          </div>
          <UFormField label="Kursus Terakhir"><UInput v-model="form.terakhir" placeholder="Nama kursus terakhir" class="w-full" /></UFormField>
          <UFormField label="Tarikh Terakhir"><UInput v-model="form.tarikhTerakhir" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tambah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod latihan ini?</p>
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
