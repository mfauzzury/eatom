<script setup lang="ts">
definePageMeta({ title: 'Rekod Dos Kebangsaan' })
const toast = useToast()

const data = ref([
  { id: 1, noPekerja: 'RW-001234', nama: 'Ahmad bin Hassan', syarikat: 'Syarikat Atom', dosQ1: '0.32', dosQ2: '0.28', dosQ3: '0.45', dosQ4: '0.35', jumlah: '1.40', status: 'Normal' },
  { id: 2, noPekerja: 'RW-001235', nama: 'Siti Fatimah', syarikat: 'Perubatan Nuklear KL', dosQ1: '0.85', dosQ2: '0.92', dosQ3: '0.78', dosQ4: '0.88', jumlah: '3.43', status: 'Siasatan' },
  { id: 3, noPekerja: 'RW-001236', nama: 'Lee Ming Hao', syarikat: 'Radiasi Teknik', dosQ1: '0.15', dosQ2: '0.22', dosQ3: '0.18', dosQ4: '0.20', jumlah: '0.75', status: 'Normal' },
  { id: 4, noPekerja: 'RW-001237', nama: 'Muthu a/l Raman', syarikat: 'Gamma Industrial', dosQ1: '0.55', dosQ2: '0.48', dosQ3: '0.62', dosQ4: '0.51', jumlah: '2.16', status: 'Normal' },
  { id: 5, noPekerja: 'RW-001238', nama: 'Nurul Ain binti Zainal', syarikat: 'MediRad Diagnostik', dosQ1: '0.42', dosQ2: '0.38', dosQ3: '0.35', dosQ4: '0.40', jumlah: '1.55', status: 'Normal' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.noPekerja.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Pekerja Dipantau', value: data.value.length, icon: 'i-lucide-users', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Normal', value: data.value.filter(d => d.status === 'Normal').length, icon: 'i-lucide-shield-check', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Siasatan', value: data.value.filter(d => d.status === 'Siasatan').length, icon: 'i-lucide-alert-triangle', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Melebihi Had', value: data.value.filter(d => d.status === 'Melebihi Had').length, icon: 'i-lucide-shield-alert', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noPekerja', header: 'No. Pekerja' },
  { accessorKey: 'nama', header: 'Nama' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'dosQ1', header: 'Q1 (mSv)' },
  { accessorKey: 'dosQ2', header: 'Q2 (mSv)' },
  { accessorKey: 'dosQ3', header: 'Q3 (mSv)' },
  { accessorKey: 'dosQ4', header: 'Q4 (mSv)' },
  { accessorKey: 'jumlah', header: 'Jumlah (mSv)' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Normal: 'success', Siasatan: 'warning', 'Melebihi Had': 'error' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ noPekerja: '', nama: '', syarikat: '', dosQ1: '0', dosQ2: '0', dosQ3: '0', dosQ4: '0' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { noPekerja: '', nama: '', syarikat: '', dosQ1: '0', dosQ2: '0', dosQ3: '0', dosQ4: '0' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { noPekerja: item.noPekerja, nama: item.nama, syarikat: item.syarikat, dosQ1: item.dosQ1, dosQ2: item.dosQ2, dosQ3: item.dosQ3, dosQ4: item.dosQ4 })
  showModal.value = true
}
function calcStatus(jumlah: number) { return jumlah > 20 ? 'Melebihi Had' : jumlah > 6 ? 'Siasatan' : 'Normal' }
function saveItem() {
  const jumlah = [form.dosQ1, form.dosQ2, form.dosQ3, form.dosQ4].reduce((a, b) => a + Number(b), 0)
  const status = calcStatus(jumlah)
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form, jumlah: jumlah.toFixed(2), status })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, ...form, jumlah: jumlah.toFixed(2), status })
    toast.add({ title: 'Berjaya', description: 'Rekod dos berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

const trendOptions = computed(() => ({
  chart: { type: 'line' as const, height: 280, toolbar: { show: false } },
  colors: ['#3b82f6', '#ef4444'],
  stroke: { width: 2, curve: 'smooth' as const },
  xaxis: { categories: ['2020', '2021', '2022', '2023', '2024', '2025'] },
  yaxis: { title: { text: 'mSv' } },
  legend: { position: 'top' as const, fontSize: '11px' },
  dataLabels: { enabled: false }
}))
const trendSeries = ref([
  { name: 'Purata Dos', data: [1.35, 1.28, 1.42, 1.15, 1.22, 1.20] },
  { name: 'Maksimum', data: [8.5, 7.2, 9.1, 6.8, 7.5, 5.2] }
])

const distOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 280, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  colors: ['#6366f1'],
  xaxis: { categories: ['<0.5', '0.5-1', '1-2', '2-5', '5-10', '10-20', '>20'], title: { text: 'Julat Dos (mSv)' } },
  yaxis: { title: { text: 'Bil. Pekerja' } },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const distSeries = ref([{ name: 'Pekerja', data: [1820, 1245, 985, 612, 142, 19, 0] }])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Rekod Dos Kebangsaan</h2>
      <p class="text-sm text-gray-500">Pangkalan data dos sinaran pekerja sinaran seluruh negara</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Trend Dos Tahunan</p></template>
        <ClientOnly>
          <apexchart type="line" height="280" :options="trendOptions" :series="trendSeries" />
          <template #fallback><div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Taburan Dos Pekerja (2025)</p></template>
        <ClientOnly>
          <apexchart type="bar" height="280" :options="distOptions" :series="distSeries" />
          <template #fallback><div class="h-[280px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari pekerja..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Tambah Rekod" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Rekod' : 'Tambah Rekod Dos' }}</h3></template>
        <div class="space-y-3">
          <UFormField v-if="!isEdit" label="No. Pekerja" required><UInput v-model="form.noPekerja" placeholder="cth: RW-001239" class="w-full" /></UFormField>
          <UFormField label="Nama" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <div class="grid grid-cols-4 gap-2">
            <UFormField label="Q1 (mSv)"><UInput v-model="form.dosQ1" type="number" step="0.01" class="w-full" /></UFormField>
            <UFormField label="Q2 (mSv)"><UInput v-model="form.dosQ2" type="number" step="0.01" class="w-full" /></UFormField>
            <UFormField label="Q3 (mSv)"><UInput v-model="form.dosQ3" type="number" step="0.01" class="w-full" /></UFormField>
            <UFormField label="Q4 (mSv)"><UInput v-model="form.dosQ4" type="number" step="0.01" class="w-full" /></UFormField>
          </div>
          <p class="text-xs text-gray-500">Status auto: Normal (&lt;6), Siasatan (6-20), Melebihi Had (&gt;20 mSv)</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.syarikat" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tambah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod dos ini?</p>
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
