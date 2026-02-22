<script setup lang="ts">
definePageMeta({ title: 'Mesyuarat' })
const toast = useToast()

const data = ref([
  { id: 1, tajuk: 'Mesyuarat Jawatankuasa Perlesenan Bil. 1/2026', tarikh: '05/03/2026', masa: '9:00 AM', lokasi: 'Bilik Mesyuarat Utama', pengerusi: 'Pengarah Penilaian', status: 'Akan Datang' },
  { id: 2, tajuk: 'Mesyuarat Pengurusan BPP Bil. 2/2026', tarikh: '12/03/2026', masa: '2:30 PM', lokasi: 'Bilik Mesyuarat 2', pengerusi: 'Kamal Ketua', status: 'Akan Datang' },
  { id: 3, tajuk: 'Mesyuarat Teknikal Kawalselia', tarikh: '20/02/2026', masa: '10:00 AM', lokasi: 'Bilik Mesyuarat 1', pengerusi: 'Kamal Ketua', status: 'Minit Belum Sedia' },
  { id: 4, tajuk: 'Mesyuarat Jawatankuasa Perlesenan Bil. 12/2025', tarikh: '15/02/2026', masa: '9:00 AM', lokasi: 'Bilik Mesyuarat Utama', pengerusi: 'Pengarah Penilaian', status: 'Selesai' },
  { id: 5, tajuk: 'Mesyuarat Pengurusan BPP Bil. 1/2026', tarikh: '08/02/2026', masa: '2:30 PM', lokasi: 'Bilik Mesyuarat 2', pengerusi: 'Kamal Ketua', status: 'Selesai' },
  { id: 6, tajuk: 'Mesyuarat Khas: Isu Pematuhan 2025', tarikh: '28/01/2026', masa: '10:00 AM', lokasi: 'Bilik Mesyuarat Utama', pengerusi: 'Pengarah Penilaian', status: 'Selesai' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.pengerusi.toLowerCase().includes(q))
})

const stats = computed(() => [
  { label: 'Jumlah Mesyuarat', value: data.value.length, icon: 'i-lucide-presentation', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Akan Datang', value: data.value.filter(d => d.status === 'Akan Datang').length, icon: 'i-lucide-calendar-plus', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Minit Belum Sedia', value: data.value.filter(d => d.status === 'Minit Belum Sedia').length, icon: 'i-lucide-file-warning', color: 'text-amber-600', bg: 'bg-amber-50' }
])

const columns = [
  { accessorKey: 'tajuk', header: 'Tajuk Mesyuarat' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'masa', header: 'Masa' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'pengerusi', header: 'Pengerusi' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { 'Akan Datang': 'info', 'Minit Belum Sedia': 'warning', Selesai: 'success' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', tarikh: '', masa: '', lokasi: '', pengerusi: '', status: 'Akan Datang' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', tarikh: '', masa: '', lokasi: '', pengerusi: '', status: 'Akan Datang' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, tarikh: item.tarikh, masa: item.masa, lokasi: item.lokasi, pengerusi: item.pengerusi, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Mesyuarat berjaya dijadualkan.', color: 'success' })
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
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Mesyuarat</h2>
      <p class="text-sm text-gray-500">Pengurusan mesyuarat, agenda dan minit mesyuarat</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg" :class="s.bg"><UIcon :name="s.icon" class="w-4 h-4" :class="s.color" /></div>
          <div><p class="text-2xl font-bold text-gray-900 leading-none">{{ s.value }}</p><p class="text-xs text-gray-500 mt-1">{{ s.label }}</p></div>
        </div>
      </UCard>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari mesyuarat..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jadual Mesyuarat Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Akan Datang'" icon="i-lucide-check" color="warning" variant="ghost" size="xs" title="Tandakan Minit Belum Sedia" @click="changeStatus(row.original.id, 'Minit Belum Sedia')" />
            <UButton v-if="row.original.status === 'Minit Belum Sedia'" icon="i-lucide-check-check" color="success" variant="ghost" size="xs" title="Tandakan Selesai" @click="changeStatus(row.original.id, 'Selesai')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Mesyuarat' : 'Jadual Mesyuarat Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk mesyuarat" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Masa"><UInput v-model="form.masa" placeholder="cth: 9:00 AM" class="w-full" /></UFormField>
          </div>
          <UFormField label="Lokasi"><UInput v-model="form.lokasi" placeholder="Bilik mesyuarat" class="w-full" /></UFormField>
          <UFormField label="Pengerusi"><UInput v-model="form.pengerusi" placeholder="Nama pengerusi" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Jadualkan' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod mesyuarat ini?</p>
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
