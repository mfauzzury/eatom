<script setup lang="ts">
definePageMeta({ title: 'Ceramah' })
const toast = useToast()

const data = ref([
  { id: 1, tajuk: 'Kesedaran Keselamatan Sinaran 2026', penceramah: 'Dr. Lim Wei', tarikh: '15/03/2026', lokasi: 'Dewan Serbaguna JTA', kehadiran: '-', status: 'Akan Datang' },
  { id: 2, tajuk: 'Perkembangan Teknologi Nuklear', penceramah: 'Prof. Ahmad Zaki', tarikh: '28/02/2026', lokasi: 'Bilik Seminar', kehadiran: '45', status: 'Selesai' },
  { id: 3, tajuk: 'Pengurusan Sisa Radioaktif', penceramah: 'Kamal Ketua', tarikh: '14/02/2026', lokasi: 'Dewan Serbaguna JTA', kehadiran: '62', status: 'Selesai' },
  { id: 4, tajuk: 'Peranan IAEA dalam Keselamatan Nuklear', penceramah: 'Pengarah Penilaian', tarikh: '30/01/2026', lokasi: 'Bilik Seminar', kehadiran: '38', status: 'Selesai' },
  { id: 5, tajuk: 'Aplikasi AI dalam Pemantauan Radiasi', penceramah: 'Dr. Nurul Ain', tarikh: '20/04/2026', lokasi: 'Dalam Talian (Webinar)', kehadiran: '-', status: 'Akan Datang' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.tajuk.toLowerCase().includes(q) || d.penceramah.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'tajuk', header: 'Tajuk Ceramah' },
  { accessorKey: 'penceramah', header: 'Penceramah' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { accessorKey: 'lokasi', header: 'Lokasi' },
  { accessorKey: 'kehadiran', header: 'Kehadiran' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusColour: Record<string, string> = { 'Akan Datang': 'info', Selesai: 'success' }

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', penceramah: '', tarikh: '', lokasi: '', kehadiran: '-', status: 'Akan Datang' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', penceramah: '', tarikh: '', lokasi: '', kehadiran: '-', status: 'Akan Datang' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, penceramah: item.penceramah, tarikh: item.tarikh, lokasi: item.lokasi, kehadiran: item.kehadiran, status: item.status })
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
    toast.add({ title: 'Berjaya', description: 'Ceramah berjaya dijadualkan.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

// Record attendance modal
const showAttendanceModal = ref(false)
const attendanceId = ref(0)
const attendanceForm = reactive({ kehadiran: '' })
function openAttendance(item: typeof data.value[0]) {
  attendanceId.value = item.id
  attendanceForm.kehadiran = ''
  showAttendanceModal.value = true
}
function saveAttendance() {
  const item = data.value.find(d => d.id === attendanceId.value)
  if (item) {
    item.kehadiran = attendanceForm.kehadiran
    item.status = 'Selesai'
    toast.add({ title: 'Kehadiran Direkodkan', description: `${item.tajuk}: ${attendanceForm.kehadiran} orang hadir.`, color: 'success' })
  }
  showAttendanceModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Ceramah</h2>
      <p class="text-sm text-gray-500">Pengurusan siri ceramah dan perkongsian ilmu</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari ceramah..." class="w-56" />
          <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Jadual Ceramah Baru" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">{{ row.original.status }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton v-if="row.original.status === 'Akan Datang'" icon="i-lucide-users" color="success" variant="ghost" size="xs" title="Rekod Kehadiran" @click="openAttendance(row.original)" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Ceramah' : 'Jadual Ceramah Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk ceramah" class="w-full" /></UFormField>
          <UFormField label="Penceramah" required><UInput v-model="form.penceramah" placeholder="Nama penceramah" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
            <UFormField label="Lokasi"><UInput v-model="form.lokasi" placeholder="Lokasi" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk || !form.penceramah" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Jadualkan' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showAttendanceModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Rekod Kehadiran</h3></template>
        <div class="space-y-3">
          <UFormField label="Bilangan Kehadiran" required><UInput v-model="attendanceForm.kehadiran" type="number" placeholder="cth: 45" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showAttendanceModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!attendanceForm.kehadiran" @click="saveAttendance">Simpan</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Rekod</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam rekod ceramah ini?</p>
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
