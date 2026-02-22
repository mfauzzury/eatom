<script setup lang="ts">
definePageMeta({ title: 'Peperiksaan & Pensijilan' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Ahmad bin Hassan', noIC: '850312-XX-XXXX', jenisPeperiksaan: 'PPB Asas', tarikh: '15/01/2026', markah: '82%', status: 'Lulus' },
  { id: 2, nama: 'Siti Aminah binti Yusof', noIC: '900715-XX-XXXX', jenisPeperiksaan: 'PPB Lanjutan', tarikh: '15/01/2026', markah: '91%', status: 'Lulus' },
  { id: 3, nama: 'Razak bin Ali', noIC: '880423-XX-XXXX', jenisPeperiksaan: 'PPB Asas', tarikh: '15/01/2026', markah: '45%', status: 'Gagal' },
  { id: 4, nama: 'Lee Wei Ming', noIC: '920108-XX-XXXX', jenisPeperiksaan: 'Pengendali Sinaran', tarikh: '20/01/2026', markah: '76%', status: 'Lulus' },
  { id: 5, nama: 'Nurul Aisyah binti Omar', noIC: '950620-XX-XXXX', jenisPeperiksaan: 'PPB Asas', tarikh: '28/02/2026', markah: '-', status: 'Belum Duduki' },
  { id: 6, nama: 'Mohd Faiz bin Ibrahim', noIC: '870930-XX-XXXX', jenisPeperiksaan: 'PPB Lanjutan', tarikh: '28/02/2026', markah: '-', status: 'Belum Duduki' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.noIC.includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Calon', value: data.value.length, icon: 'i-lucide-graduation-cap', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Lulus', value: data.value.filter(d => d.status === 'Lulus').length, icon: 'i-lucide-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Gagal', value: data.value.filter(d => d.status === 'Gagal').length, icon: 'i-lucide-x-circle', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Belum Duduki', value: data.value.filter(d => d.status === 'Belum Duduki').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'nama', header: 'Nama Calon' },
  { accessorKey: 'noIC', header: 'No. KP' },
  { accessorKey: 'jenisPeperiksaan', header: 'Jenis' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'markah', header: 'Markah' },
  { accessorKey: 'status', header: 'Keputusan' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Lulus: 'success', Gagal: 'error', 'Belum Duduki': 'warning' }
const jenisOptions = ['PPB Asas', 'PPB Lanjutan', 'Pengendali Sinaran'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', noIC: '', jenisPeperiksaan: '', tarikh: '', markah: '-', status: 'Belum Duduki' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', noIC: '', jenisPeperiksaan: '', tarikh: '', markah: '-', status: 'Belum Duduki' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, noIC: item.noIC, jenisPeperiksaan: item.jenisPeperiksaan, tarikh: item.tarikh, markah: item.markah, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Calon berjaya didaftarkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

// Result entry modal
const showResultModal = ref(false)
const resultId = ref(0)
const resultForm = reactive({ markah: '', status: 'Lulus' })
function openResult(item: typeof data.value[0]) {
  resultId.value = item.id
  resultForm.markah = ''; resultForm.status = 'Lulus'
  showResultModal.value = true
}
function saveResult() {
  const item = data.value.find(d => d.id === resultId.value)
  if (item) {
    item.markah = resultForm.markah + '%'
    item.status = Number(resultForm.markah) >= 50 ? 'Lulus' : 'Gagal'
    toast.add({ title: 'Keputusan Direkodkan', description: `${item.nama}: ${item.status} (${item.markah})`, color: 'success' })
  }
  showResultModal.value = false
}

const chartOptions = computed(() => ({
  chart: { type: 'donut' as const, height: 260 },
  labels: ['Lulus', 'Gagal', 'Belum Duduki'],
  colors: ['#10b981', '#ef4444', '#f59e0b'],
  legend: { position: 'bottom' as const, fontSize: '12px' },
  plotOptions: { pie: { donut: { size: '55%' } } }
}))
const chartSeries = computed(() => [
  data.value.filter(d => d.status === 'Lulus').length,
  data.value.filter(d => d.status === 'Gagal').length,
  data.value.filter(d => d.status === 'Belum Duduki').length
])

const trendOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  colors: ['#10b981', '#ef4444'],
  xaxis: { categories: ['Sep', 'Okt', 'Nov', 'Dis', 'Jan', 'Feb'] },
  dataLabels: { enabled: false },
  legend: { position: 'top' as const, fontSize: '11px' }
}))
const trendSeries = ref([
  { name: 'Lulus', data: [18, 22, 25, 20, 28, 19] },
  { name: 'Gagal', data: [3, 2, 5, 4, 2, 2] }
])
</script>

<template>
  <div>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Peperiksaan & Pensijilan</h2>
      <p class="text-sm text-gray-500">Pengurusan peperiksaan PPB dan pensijilan pengendali sinaran</p>
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Keputusan Peperiksaan</p></template>
        <ClientOnly>
          <apexchart type="donut" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-65 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Trend Peperiksaan (6 Bulan)</p></template>
        <ClientOnly>
          <apexchart type="bar" height="260" :options="trendOptions" :series="trendSeries" />
          <template #fallback><div class="h-65 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari nama atau No. KP..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Daftar Calon" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Belum Duduki'" icon="i-lucide-clipboard-pen" color="info" variant="ghost" size="xs" @click="openResult(row.original)" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Calon' : 'Daftar Calon Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="No. Kad Pengenalan" required><UInput v-model="form.noIC" placeholder="XXXXXX-XX-XXXX" class="w-full" /></UFormField>
          <UFormField label="Jenis Peperiksaan" required><USelect v-model="form.jenisPeperiksaan" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.noIC || !form.jenisPeperiksaan" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Daftar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showResultModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Masukkan Keputusan Peperiksaan</h3></template>
        <div class="space-y-3">
          <UFormField label="Markah (%)" required><UInput v-model="resultForm.markah" type="number" :min="0" :max="100" placeholder="0-100" class="w-full" /></UFormField>
          <p class="text-xs text-gray-500">Markah 50% ke atas = Lulus, bawah 50% = Gagal</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showResultModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!resultForm.markah" @click="saveResult">Simpan Keputusan</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod calon ini?</p>
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
