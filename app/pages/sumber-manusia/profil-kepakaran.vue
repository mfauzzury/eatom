<script setup lang="ts">
definePageMeta({ title: 'Profil Kepakaran' })
const toast = useToast()

const profiles = ref([
  { id: 1, nama: 'Siti Semakan', jawatan: 'Pegawai Semakan', kepakaran: ['Perlindungan Sinaran', 'Dosimetri', 'QA/QC'], kelayakan: 'M.Sc. Fizik Perubatan', pengalaman: '8 tahun' },
  { id: 2, nama: 'Kamal Ketua', jawatan: 'Ketua Unit Perlesenan', kepakaran: ['Pengurusan Lesen', 'Kawalselia', 'Keselamatan Nuklear'], kelayakan: 'M.Sc. Sains Nuklear', pengalaman: '12 tahun' },
  { id: 3, nama: 'Pengarah Penilaian', jawatan: 'Pengarah BPP', kepakaran: ['Polisi Nuklear', 'Pengurusan Strategik', 'Hubungan Antarabangsa'], kelayakan: 'Ph.D. Fizik Nuklear', pengalaman: '20 tahun' },
  { id: 4, nama: 'Nurul Hafizah', jawatan: 'Pegawai Sains', kepakaran: ['Pemantauan Radiasi', 'Persampelan Alam Sekitar', 'ERMS'], kelayakan: 'B.Sc. Sains Persekitaran', pengalaman: '4 tahun' },
  { id: 5, nama: 'Mohd Rizal', jawatan: 'Pegawai Fizik', kepakaran: ['Radioterapi', 'Fizik Perubatan', 'Kalibrasi'], kelayakan: 'M.Sc. Fizik Perubatan', pengalaman: '6 tahun' },
  { id: 6, nama: 'Dr. Lim Wei', jawatan: 'Pakar Perunding', kepakaran: ['Keselamatan Sinaran', 'Penilaian Risiko', 'Dekomisioning'], kelayakan: 'Ph.D. Kejuruteraan Nuklear', pengalaman: '15 tahun' }
])

const search = ref('')
const filteredProfiles = computed(() => {
  if (!search.value) return profiles.value
  const q = search.value.toLowerCase()
  return profiles.value.filter(p => p.nama.toLowerCase().includes(q) || p.kepakaran.some(k => k.toLowerCase().includes(q)))
})

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const form = reactive({ nama: '', jawatan: '', kelayakan: '', pengalaman: '', kepakaranText: '' })

function openCreate() {
  isEdit.value = false
  Object.assign(form, { nama: '', jawatan: '', kelayakan: '', pengalaman: '', kepakaranText: '' })
  showModal.value = true
}
function openEdit(item: typeof profiles.value[0]) {
  isEdit.value = true; editId.value = item.id
  Object.assign(form, { nama: item.nama, jawatan: item.jawatan, kelayakan: item.kelayakan, pengalaman: item.pengalaman, kepakaranText: item.kepakaran.join(', ') })
  showModal.value = true
}
function saveItem() {
  const kepakaran = form.kepakaranText.split(',').map(s => s.trim()).filter(Boolean)
  if (isEdit.value) {
    const idx = profiles.value.findIndex(d => d.id === editId.value)
    if (idx >= 0) Object.assign(profiles.value[idx], { nama: form.nama, jawatan: form.jawatan, kelayakan: form.kelayakan, pengalaman: form.pengalaman, kepakaran })
    toast.add({ title: 'Dikemaskini', color: 'success' })
  } else {
    const maxId = Math.max(...profiles.value.map(d => d.id), 0)
    profiles.value.push({ id: maxId + 1, nama: form.nama, jawatan: form.jawatan, kelayakan: form.kelayakan, pengalaman: form.pengalaman, kepakaran })
    toast.add({ title: 'Berjaya', description: 'Profil berjaya ditambah.', color: 'success' })
  }
  showModal.value = false
}

const showDelete = ref(false)
const deleteId = ref(0)
function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
function doDelete() { profiles.value = profiles.value.filter(d => d.id !== deleteId.value); showDelete.value = false; toast.add({ title: 'Dipadam', color: 'success' }) }

const chartOptions = computed(() => ({
  chart: { type: 'bar' as const, height: 260, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  colors: ['#6366f1'],
  xaxis: { categories: ['Perlindungan Sinaran', 'Pengurusan', 'Dosimetri', 'Kawalselia', 'Fizik Perubatan', 'Pemantauan'] },
  dataLabels: { enabled: true },
  tooltip: { enabled: false }
}))
const chartSeries = ref([{ name: 'Pakar', data: [5, 4, 3, 3, 2, 2] }])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Profil Kepakaran</h2>
        <p class="text-sm text-gray-500">Direktori kepakaran dan kelayakan pegawai</p>
      </div>
      <div class="flex gap-2">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Cari nama atau kepakaran..." class="w-56" />
        <UButton icon="i-lucide-plus" color="neutral" size="xs" label="Tambah Profil" @click="openCreate" />
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UCard v-for="p in filteredProfiles" :key="p.id">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UAvatar :alt="p.nama" size="sm" />
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ p.nama }}</p>
                    <p class="text-xs text-gray-500">{{ p.jawatan }}</p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(p)" />
                  <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(p.id)" />
                </div>
              </div>
              <div class="text-xs text-gray-600"><span class="font-medium">Kelayakan:</span> {{ p.kelayakan }}</div>
              <div class="text-xs text-gray-600"><span class="font-medium">Pengalaman:</span> {{ p.pengalaman }}</div>
              <div class="flex flex-wrap gap-1">
                <UBadge v-for="k in p.kepakaran" :key="k" color="neutral" variant="subtle" size="xs">{{ k }}</UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <UCard>
        <template #header><p class="text-sm font-semibold text-gray-700">Pecahan Kepakaran</p></template>
        <ClientOnly>
          <apexchart type="bar" height="260" :options="chartOptions" :series="chartSeries" />
          <template #fallback><div class="h-[260px] flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div></template>
        </ClientOnly>
      </UCard>
    </div>
  </div>

  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <template #header><h3 class="font-semibold">{{ isEdit ? 'Sunting Profil' : 'Tambah Profil Baru' }}</h3></template>
        <div class="space-y-3">
          <UFormField label="Nama" required><UInput v-model="form.nama" placeholder="Nama penuh" class="w-full" /></UFormField>
          <UFormField label="Jawatan"><UInput v-model="form.jawatan" placeholder="Jawatan" class="w-full" /></UFormField>
          <UFormField label="Kelayakan"><UInput v-model="form.kelayakan" placeholder="cth: M.Sc. Fizik Perubatan" class="w-full" /></UFormField>
          <UFormField label="Pengalaman"><UInput v-model="form.pengalaman" placeholder="cth: 8 tahun" class="w-full" /></UFormField>
          <UFormField label="Kepakaran (pisah dengan koma)"><UInput v-model="form.kepakaranText" placeholder="cth: Dosimetri, QA/QC, Perlindungan Sinaran" class="w-full" /></UFormField>
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
        <template #header><h3 class="font-semibold">Padam Profil</h3></template>
        <p class="text-sm">Adakah anda pasti untuk memadam profil ini?</p>
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
