<script setup lang="ts">
definePageMeta({ title: 'Tempahan Bilik' })
const toast = useToast()

const rooms = ref([
  { nama: 'Bilik Mesyuarat Utama', kapasiti: 30, peralatan: 'Projektor, Skrin, Video Conference', status: 'Tersedia' },
  { nama: 'Bilik Mesyuarat 1', kapasiti: 15, peralatan: 'Projektor, Whiteboard', status: 'Sedang Digunakan' },
  { nama: 'Bilik Mesyuarat 2', kapasiti: 10, peralatan: 'TV Skrin, Whiteboard', status: 'Tersedia' },
  { nama: 'Bilik Seminar', kapasiti: 50, peralatan: 'PA System, Projektor, Podium', status: 'Tersedia' },
  { nama: 'Dewan Serbaguna', kapasiti: 200, peralatan: 'PA System, Projektor, Pentas', status: 'Tersedia' },
  { nama: 'Bilik Latihan ICT', kapasiti: 20, peralatan: '20 PC, Projektor, Printer', status: 'Penyelenggaraan' }
])

const bookings = ref([
  { id: 1, bilik: 'Bilik Mesyuarat 1', pemohon: 'Kamal Ketua', tajuk: 'Mesyuarat Perlesenan', tarikh: '22/02/2026', masa: '10:00 - 12:00', status: 'Aktif' },
  { id: 2, bilik: 'Bilik Mesyuarat Utama', pemohon: 'Pengarah Penilaian', tajuk: 'Mesyuarat Pengurusan', tarikh: '25/02/2026', masa: '9:00 - 11:00', status: 'Disahkan' },
  { id: 3, bilik: 'Bilik Seminar', pemohon: 'Siti Semakan', tajuk: 'Bengkel Keselamatan Sinaran', tarikh: '01/03/2026', masa: '9:00 - 17:00', status: 'Disahkan' },
  { id: 4, bilik: 'Dewan Serbaguna', pemohon: 'Ahmad Admin', tajuk: 'Ceramah Bulanan', tarikh: '05/03/2026', masa: '14:30 - 16:30', status: 'Menunggu' }
])

const search = ref('')
const filteredBookings = computed(() => {
  if (!search.value) return bookings.value
  const q = search.value.toLowerCase()
  return bookings.value.filter(d => d.bilik.toLowerCase().includes(q) || d.pemohon.toLowerCase().includes(q))
})

const bookingColumns = [
  { accessorKey: 'bilik', header: 'Bilik' },
  { accessorKey: 'pemohon', header: 'Pemohon' },
  { accessorKey: 'tajuk', header: 'Tajuk' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'masa', header: 'Masa' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const roomColour: Record<string, string> = { Tersedia: 'success', 'Sedang Digunakan': 'warning', Penyelenggaraan: 'error' }
const statusColour: Record<string, string> = { Aktif: 'success', Disahkan: 'info', Menunggu: 'warning' }
const bilikOptions = rooms.value.map(r => ({ label: r.nama, value: r.nama }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ bilik: '', pemohon: '', tajuk: '', tarikh: '', masa: '', status: 'Menunggu' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { bilik: '', pemohon: '', tajuk: '', tarikh: '', masa: '', status: 'Menunggu' })
  showModal.value = true
}
function openEdit(item: typeof bookings.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { bilik: item.bilik, pemohon: item.pemohon, tajuk: item.tajuk, tarikh: item.tarikh, masa: item.masa, status: item.status })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = bookings.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(bookings.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...bookings.value.map(d => d.id), 0)
    bookings.value.push({ id: maxId + 1, ...form })
    toast.add({ title: 'Berjaya', description: 'Tempahan bilik berjaya dihantar.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { bookings.value = bookings.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function changeStatus(id: number, status: string) {
  const item = bookings.value.find(d => d.id === id)
  if (item) { item.status = status; toast.add({ title: 'Status Dikemaskini', description: `Tempahan ${status.toLowerCase()}.`, color: 'success' }) }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Tempahan Bilik</h2>
      <p class="text-sm text-gray-500">Sistem tempahan bilik mesyuarat dan kemudahan</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <UCard v-for="r in rooms" :key="r.nama">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-gray-900">{{ r.nama }}</p>
            <UBadge :color="roomColour[r.status] ?? 'neutral'" variant="soft" size="xs">{{ r.status }}</UBadge>
          </div>
          <p class="text-xs text-gray-500">Kapasiti: {{ r.kapasiti }} orang</p>
          <p class="text-xs text-gray-400">{{ r.peralatan }}</p>
        </div>
      </UCard>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari tempahan..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Tempah Bilik" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredBookings" :columns="bookingColumns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Menunggu'" icon="i-lucide-check" color="success" variant="ghost" size="xs" @click="changeStatus(row.original.id, 'Disahkan')" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Tempahan' : 'Tempah Bilik' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Bilik" required><USelect v-model="form.bilik" :items="bilikOptions" placeholder="Pilih bilik" class="w-full" /></UFormField>
          <UFormField label="Pemohon" required><UInput v-model="form.pemohon" placeholder="Nama pemohon" class="w-full" /></UFormField>
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk mesyuarat/acara" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Masa"><UInput v-model="form.masa" placeholder="cth: 9:00 - 11:00" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.bilik || !form.pemohon || !form.tajuk" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tempah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Tempahan</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam tempahan ini?</p>
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
