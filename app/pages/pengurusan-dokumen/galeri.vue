<script setup lang="ts">
definePageMeta({ title: 'Galeri' })
const toast = useToast()

const albums = ref([
  { id: 1, tajuk: 'Pemeriksaan Tapak - Gebeng, Pahang', tarikh: '15/02/2026', bilFoto: 24, kategori: 'Kawalselia' },
  { id: 2, tajuk: 'Majlis Penyerahan Lesen 2025', tarikh: '20/12/2025', bilFoto: 45, kategori: 'Acara' },
  { id: 3, tajuk: 'Bengkel Keselamatan Sinaran Nasional', tarikh: '10/01/2026', bilFoto: 32, kategori: 'Latihan' },
  { id: 4, tajuk: 'Lawatan Kerja ke Loji NORM', tarikh: '05/02/2026', bilFoto: 18, kategori: 'Lawatan' },
  { id: 5, tajuk: 'Kalibrasi Peralatan - Makmal SSDL', tarikh: '28/01/2026', bilFoto: 12, kategori: 'Teknikal' },
  { id: 6, tajuk: 'Hari Kualiti JTA 2025', tarikh: '15/11/2025', bilFoto: 56, kategori: 'Acara' },
  { id: 7, tajuk: 'Pemeriksaan Tapak - Hospital Serdang', tarikh: '10/01/2026', bilFoto: 15, kategori: 'Kawalselia' },
  { id: 8, tajuk: 'Mesyuarat IAEA Technical Meeting', tarikh: '25/11/2025', bilFoto: 20, kategori: 'Mesyuarat' }
])

const search = ref('')
const filteredAlbums = computed(() => {
  if (!search.value) return albums.value
  const q = search.value.toLowerCase()
  return albums.value.filter(a => a.tajuk.toLowerCase().includes(q) || a.kategori.toLowerCase().includes(q))
})

const colours = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700']
const kategoriOptions = ['Kawalselia', 'Acara', 'Latihan', 'Lawatan', 'Teknikal', 'Mesyuarat'].map(v => ({ label: v, value: v }))

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ tajuk: '', kategori: '', bilFoto: 0, tarikh: '' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { tajuk: '', kategori: '', bilFoto: 0, tarikh: new Date().toLocaleDateString('en-GB') })
  showModal.value = true
}
function openEdit(item: typeof albums.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { tajuk: item.tajuk, kategori: item.kategori, bilFoto: item.bilFoto, tarikh: item.tarikh })
  showModal.value = true
}
function saveItem() {
  if (isEdit.value) {
    const idx = albums.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(albums.value[idx], { ...form })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...albums.value.map(d => d.id), 0)
    albums.value.push({ id: maxId + 1, ...form })
    toast.add({ title: 'Berjaya', description: 'Album berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { albums.value = albums.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Galeri</h2>
        <p class="text-sm text-gray-500">Galeri foto dan dokumentasi visual aktiviti organisasi</p>
      </div>
      <div class="flex gap-2">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari album..." class="w-56" />
        <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Album Baru" @click="openCreate" />
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(album, i) in filteredAlbums" :key="album.id" class="group">
        <div class="aspect-video rounded-lg bg-gray-200 flex items-center justify-center mb-2">
          <UIcon name="i-lucide-image" class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-xs font-medium text-gray-800 leading-tight">{{ album.tajuk }}</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs px-1.5 py-0.5 rounded" :class="colours[i % colours.length]">{{ album.kategori }}</span>
          <span class="text-xs text-gray-400">{{ album.bilFoto }} foto</span>
        </div>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-400">{{ album.tarikh }}</p>
          <div class="flex gap-1">
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(album)" />
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(album.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Album' : 'Album Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Tajuk" required><UInput v-model="form.tajuk" placeholder="Tajuk album" class="w-full" /></UFormField>
          <UFormField label="Kategori" required><USelect v-model="form.kategori" :items="kategoriOptions" placeholder="Pilih kategori" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Bil. Foto"><UInput v-model="form.bilFoto" type="number" class="w-full" /></UFormField>
            <UFormField label="Tarikh"><UInput v-model="form.tarikh" placeholder="DD/MM/YYYY" class="w-full" /></UFormField>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
            <UButton color="neutral" :disabled="!form.tajuk || !form.kategori" @click="saveItem">{{ isEdit ? 'Kemaskini' : 'Tambah' }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="showDelete">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">Padam Album</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam album ini?</p>
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
