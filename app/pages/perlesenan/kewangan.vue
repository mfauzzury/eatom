<script setup lang="ts">
definePageMeta({ title: 'Kewangan' })
const toast = useToast()

const data = ref([
  { id: 1, noInvois: 'INV-2026-0234', syarikat: 'Syarikat Atom Sdn Bhd', jenis: 'Fi Lesen', jumlah: '5,000.00', tarikh: '01/02/2026', status: 'Telah Bayar' },
  { id: 2, noInvois: 'INV-2026-0233', syarikat: 'Radiasi Teknik Sdn Bhd', jenis: 'Fi Permohonan', jumlah: '2,500.00', tarikh: '28/01/2026', status: 'Telah Bayar' },
  { id: 3, noInvois: 'INV-2026-0232', syarikat: 'Perubatan Nuklear KL', jenis: 'Fi Lesen', jumlah: '8,000.00', tarikh: '25/01/2026', status: 'Belum Bayar' },
  { id: 4, noInvois: 'INV-2026-0231', syarikat: 'Gamma Industrial', jenis: 'Fi Pembaharuan', jumlah: '3,500.00', tarikh: '20/01/2026', status: 'Telah Bayar' },
  { id: 5, noInvois: 'INV-2026-0230', syarikat: 'MediRad Diagnostik', jenis: 'Fi Lesen', jumlah: '5,000.00', tarikh: '15/01/2026', status: 'Belum Bayar' },
  { id: 6, noInvois: 'INV-2025-0198', syarikat: 'Isotop Malaysia Bhd', jenis: 'Fi Permohonan', jumlah: '2,500.00', tarikh: '10/12/2025', status: 'Tertunggak' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.noInvois.toLowerCase().includes(q) || d.syarikat.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Kutipan (2026)', value: 'RM 1.24M', icon: 'i-lucide-banknote', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Belum Bayar', value: data.value.filter(d => d.status === 'Belum Bayar').length, icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Invois Dikeluarkan', value: data.value.length, icon: 'i-lucide-receipt', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Tertunggak', value: data.value.filter(d => d.status === 'Tertunggak').length, icon: 'i-lucide-alert-triangle', color: 'text-red-600', bg: 'bg-red-50' }
])

const columns = [
  { accessorKey: 'noInvois', header: 'No. Invois' },
  { accessorKey: 'syarikat', header: 'Syarikat' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'jumlah', header: 'Jumlah (RM)' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { 'Telah Bayar': 'success', 'Belum Bayar': 'warning', Tertunggak: 'error' }
const jenisOptions = ['Fi Lesen', 'Fi Permohonan', 'Fi Pembaharuan', 'Fi Peperiksaan', 'Lain-lain'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ syarikat: '', jenis: '', jumlah: '', tarikh: '', status: 'Belum Bayar' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { syarikat: '', jenis: '', jumlah: '', tarikh: '', status: 'Belum Bayar' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { syarikat: item.syarikat, jenis: item.jenis, jumlah: item.jumlah, tarikh: item.tarikh, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = data.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(data.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...data.value.map(d => d.id), 0)
    data.value.push({ id: maxId + 1, noInvois: `INV-2026-${String(234 + maxId + 1).padStart(4, '0')}`, ...form })
    toast.add({ title: 'Berjaya', description: 'Invois berjaya dijana.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function markPaid(id: number) {
  const item = data.value.find(d => d.id === id)
  if (item) { item.status = 'Telah Bayar'; toast.add({ title: 'Bayaran Direkodkan', description: `Invois ${item.noInvois} telah dibayar.`, color: 'success' }) }
}

const revenueOptions = computed(() => ({
  chart: { type: 'area' as const, height: 280, toolbar: { show: false } },
  colors: ['#10b981'],
  stroke: { curve: 'smooth' as const, width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: { categories: ['Sep', 'Okt', 'Nov', 'Dis', 'Jan', 'Feb'] },
  yaxis: { labels: { formatter: (v: number) => 'RM ' + (v / 1000).toFixed(0) + 'K' } },
  dataLabels: { enabled: false }
}))
const revenueSeries = ref([{ name: 'Kutipan (RM)', data: [185000, 210000, 195000, 230000, 245000, 175000] }])

const breakdownOptions = computed(() => ({
  chart: { type: 'pie' as const, height: 280 },
  labels: ['Fi Lesen', 'Fi Permohonan', 'Fi Pembaharuan', 'Fi Peperiksaan', 'Lain-lain'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'],
  legend: { position: 'bottom' as const, fontSize: '11px' }
}))
const breakdownSeries = ref([520000, 310000, 245000, 98000, 67000])
</script>

<template>
  <div>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Kewangan</h2>
      <p class="text-sm text-gray-500">Pengurusan invois, kutipan fi dan jaminan kewangan</p>
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

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <UCard class="lg:col-span-3">
        <template #header><p class="text-sm font-semibold text-gray-700">Trend Kutipan (6 Bulan)</p></template>
        <ClientOnly>
          <apexchart type="area" height="280" :options="revenueOptions" :series="revenueSeries" />
          <template #fallback><div class="h-70 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
      <UCard class="lg:col-span-2">
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Jenis Fi</p></template>
        <ClientOnly>
          <apexchart type="pie" height="280" :options="breakdownOptions" :series="breakdownSeries" />
          <template #fallback><div class="h-70 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari invois atau syarikat..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jana Invois" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Belum Bayar' || row.original.status === 'Tertunggak'" icon="i-lucide-credit-card" color="success" variant="ghost" size="xs" @click="markPaid(row.original.id)" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Invois' : 'Jana Invois Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Syarikat" required><UInput v-model="form.syarikat" placeholder="Nama syarikat" class="w-full" /></UFormField>
          <UFormField label="Jenis Fi" required><USelect v-model="form.jenis" :items="jenisOptions" placeholder="Pilih jenis" class="w-full" /></UFormField>
          <UFormField label="Jumlah (RM)" required><UInput v-model="form.jumlah" placeholder="cth: 5,000.00" class="w-full" /></UFormField>
          <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.syarikat || !form.jenis || !form.jumlah" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Jana' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Invois</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam invois ini?</p>
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
