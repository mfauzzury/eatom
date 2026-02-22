<script setup lang="ts">
definePageMeta({ title: 'Dokumen Panduan' })
const toast = useToast()

const data = ref([
  { id: 1, nama: 'Garis Panduan Keselamatan Sinaran (GP-01)', kategori: 'Keselamatan', versi: 'v3.2', tarikh: '15/01/2026', saiz: '2.4 MB' },
  { id: 2, nama: 'Prosedur Operasi Standard - Pemeriksaan (SOP-KS-01)', kategori: 'Kawalselia', versi: 'v2.1', tarikh: '10/12/2025', saiz: '1.8 MB' },
  { id: 3, nama: 'Manual Pengurusan Perlesenan', kategori: 'Perlesenan', versi: 'v4.0', tarikh: '01/01/2026', saiz: '5.2 MB' },
  { id: 4, nama: 'Panduan Pengendalian Kecemasan Sinaran', kategori: 'Kecemasan', versi: 'v2.0', tarikh: '20/11/2025', saiz: '3.1 MB' },
  { id: 5, nama: 'Kod Amalan Pengangkutan Bahan Radioaktif', kategori: 'Pengangkutan', versi: 'v1.5', tarikh: '05/10/2025', saiz: '1.2 MB' },
  { id: 6, nama: 'Garis Panduan Pemantauan Dos Pekerja', kategori: 'Dosimetri', versi: 'v2.3', tarikh: '15/09/2025', saiz: '1.5 MB' },
  { id: 7, nama: 'Manual Sistem Pengurusan Kualiti ISO 9001', kategori: 'ISO', versi: 'v5.0', tarikh: '01/01/2026', saiz: '4.8 MB' },
  { id: 8, nama: 'Panduan Penggunaan Sistem eATOM', kategori: 'ICT', versi: 'v1.0', tarikh: '01/02/2026', saiz: '2.0 MB' }
])

const search = ref('')
const filteredData = computed(() => {
  if (!search.value) return data.value
  const q = search.value.toLowerCase()
  return data.value.filter(d => d.nama.toLowerCase().includes(q) || d.kategori.toLowerCase().includes(q))
})

const columns = [
  { accessorKey: 'nama', header: 'Nama Dokumen' },
  { accessorKey: 'kategori', header: 'Kategori' },
  { accessorKey: 'versi', header: 'Versi' },
  { accessorKey: 'tarikh', header: 'Tarikh Kemaskini' },
  { accessorKey: 'saiz', header: 'Saiz' },
  { id: 'actions', header: '' }
]

const kategoriOptions = ['Keselamatan', 'Kawalselia', 'Perlesenan', 'Kecemasan', 'Pengangkutan', 'Dosimetri', 'ISO', 'ICT'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', kategori: '', versi: '', tarikh: '', saiz: '' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', kategori: '', versi: '', tarikh: '', saiz: '' })
  showModal.value = true
}
function openEdit(item: typeof data.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, kategori: item.kategori, versi: item.versi, tarikh: item.tarikh, saiz: item.saiz })
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
    toast.add({ title: 'Berjaya', description: 'Dokumen berjaya dimuat naik.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { data.value = data.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

function downloadDoc(item: typeof data.value[0]) {
  toast.add({ title: 'Memuat Turun', description: `${item.nama} (${item.saiz})`, color: 'info' })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Dokumen Panduan</h2>
      <p class="text-sm text-gray-500">Repositori garis panduan, SOP dan manual rujukan</p>
    </div>
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Cari dokumen..." class="w-56" />
          <UButton icon="i-lucide-upload" color="neutral" size="xs" label="Muat Naik" @click="openCreate" />
        </div>
      </template>
      <UTable :data="filteredData" :columns="columns">
        <template #kategori-cell="{ row }">
          <UBadge color="neutral" variant="subtle" size="xs">{{ row.original.kategori }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton icon="i-lucide-download" color="neutral" variant="ghost" size="xs" @click="downloadDoc(row.original)" />
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
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Dokumen' : 'Muat Naik Dokumen Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama Dokumen" required><UInput v-model="form.nama" placeholder="Nama dokumen" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Versi"><UInput v-model="form.versi" placeholder="cth: v1.0" class="w-full" /></UFormField>
            <UFormField label="Saiz"><UInput v-model="form.saiz" placeholder="cth: 2.4 MB" class="w-full" /></UFormField>
          </div>
          <UFormField label="Tarikh Kemaskini"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.nama || !form.kategori" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Muat Naik' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Dokumen</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam dokumen ini?</p>
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
