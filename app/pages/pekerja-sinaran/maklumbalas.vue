<script setup lang="ts">
definePageMeta({ title: 'Maklumbalas' })
const toast = useToast()

const data = ref([
  { id: 1, noTiket: 'FB-2026-001', pengirim: 'Mohd Hafiz', tajuk: 'Pertanyaan mengenai sijil PPB', kategori: 'Pertanyaan', tarikh: '18/02/2026', status: 'Selesai' },
  { id: 2, noTiket: 'FB-2026-002', pengirim: 'Tan Mei Ling', tajuk: 'Permohonan salinan keputusan peperiksaan', kategori: 'Permohonan', tarikh: '19/02/2026', status: 'Dalam Tindakan' },
  { id: 3, noTiket: 'FB-2026-003', pengirim: 'Ravi Kumar', tajuk: 'Cadangan penambahbaikan sistem pendaftaran', kategori: 'Cadangan', tarikh: '20/02/2026', status: 'Baru' },
  { id: 4, noTiket: 'FB-2026-004', pengirim: 'Aisyah Ahmad', tajuk: 'Aduan kelewatan proses kelulusan', kategori: 'Aduan', tarikh: '21/02/2026', status: 'Baru' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.pengirim.toLowerCase().includes(q) || d.tajuk.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'noTiket', header: 'No. Tiket' },
  { accessorKey: 'pengirim', header: 'Pengirim' },
  { accessorKey: 'tajuk', header: 'Tajuk' },
  { accessorKey: 'kategori', header: 'Kategori' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { Selesai: 'success', 'Dalam Tindakan': 'warning', Baru: 'info' }
const kategoriOptions = ['Pertanyaan', 'Permohonan', 'Cadangan', 'Aduan'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ pengirim: '', tajuk: '', kategori: '', tarikh: '', status: 'Baru' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { pengirim: '', tajuk: '', kategori: '', tarikh: new Date().toLocaleDateString('en-GB'), status: 'Baru' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { pengirim: item.pengirim, tajuk: item.tajuk, kategori: item.kategori, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noTiket: `FB-2026-${String(maxId + 1).padStart(3, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Maklumbalas berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Tiket ${item.noTiket}: ${status}`, color: 'success' }) }
}

const chartOptions = computed(() => ({
  chart: { type: 'donut' as const, height: 250 },
  labels: ['Pertanyaan', 'Permohonan', 'Cadangan', 'Aduan'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  legend: { position: 'bottom' as const, fontSize: '11px' },
  plotOptions: { pie: { donut: { size: '50%' } } }
}))
const chartSeries = ref([15, 8, 5, 3])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Maklumbalas</h2>
      <p class="text-sm text-gray-500">Pengurusan maklumbalas, pertanyaan dan aduan pekerja sinaran</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <UCard :ui="{ body: 'p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <UInput v-model="search" icon="i-lucide-search" placeholder="Cari maklumbalas..." class="w-56" />
              <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Maklumbalas Baru" @click="openCreate" />
            </div>
          </template>
          <UTable :data="filteredData" :columns="columns">
            <template #kategori-cell="{ row }">
              <UBadge color="neutral" variant="subtle" size="xs">{{ row.original.kategori }}</UBadge>
            </template>
            <template #status-cell="{ row }">
              <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'Baru'" icon="i-lucide-play" color="info" variant="ghost" size="xs" title="Dalam Tindakan" @click="changeStatus(row.original.id, 'Dalam Tindakan')" />
                <UButton v-if="row.original.status === 'Dalam Tindakan'" icon="i-lucide-check-check" color="success" variant="ghost" size="xs" title="Selesai" @click="changeStatus(row.original.id, 'Selesai')" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(row.original)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(row.original.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Kategori</p></template>
        <ClientOnly>
          <apexchart type="donut" height="250" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[250px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Maklumbalas' : 'Maklumbalas Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Pengirim" required><UInput v-model="form.pengirim" placeholder="Nama pengirim" class="w-full" /></UFormField>
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk maklumbalas" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.pengirim || !form.tajuk || !form.kategori" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Hantar' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam maklumbalas ini?</p>
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
