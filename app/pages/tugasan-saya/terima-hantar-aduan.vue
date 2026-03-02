<script setup lang="ts">
definePageMeta({ title: 'Terima Aduan' })

const { isInternal } = useAuthUser()
const toast = useToast()

// Redirect non-staff users away
if (import.meta.client && !isInternal.value) {
  await navigateTo('/dashboard')
}

interface Aduan {
  id: number
  tajuk: string
  pengadu: string
  keutamaan: 'tinggi' | 'sederhana' | 'rendah'
  status: 'menunggu' | 'dalam_proses' | 'selesai'
  tarikh: string
  penerangan: string
  lokasi: string
  tindakan: string
}

// Shared state — same key as profil-saya/hantar-aduan page
const aduanList = useState<Aduan[]>('aduan_list', () => [
  { id: 1, tajuk: 'Kerosakan Alat Pengukur Radiasi', pengadu: 'Ahmad Teknisi', keutamaan: 'tinggi', status: 'dalam_proses', tarikh: '2026-02-20', penerangan: 'Alat pengukur radiasi di makmal B3 tidak berfungsi sejak minggu lepas. Bacaan tidak konsisten dan perlu penggantian segera.', lokasi: 'Makmal B3, Aras 2', tindakan: 'Telah hubungi vendor untuk pembaikan.' },
  { id: 2, tajuk: 'Kebocoran Paip di Stor Bahan', pengadu: 'Siti Penyelenggara', keutamaan: 'tinggi', status: 'menunggu', tarikh: '2026-02-22', penerangan: 'Terdapat kebocoran paip di stor bahan kimia yang boleh menjejaskan keselamatan bahan. Memerlukan tindakan segera.', lokasi: 'Stor Bahan, Aras 1', tindakan: '' },
  { id: 3, tajuk: 'Sistem Pendingin Hawa Tidak Berfungsi', pengadu: 'Kamal Operator', keutamaan: 'sederhana', status: 'dalam_proses', tarikh: '2026-02-18', penerangan: 'Pendingin hawa di bilik kawalan tidak berfungsi menyebabkan suhu melebihi had yang ditetapkan untuk peralatan sensitif.', lokasi: 'Bilik Kawalan, Aras 3', tindakan: 'Unit penyelenggaraan sedang menjalankan pembaikan.' },
  { id: 4, tajuk: 'Lampu Kecemasan Tidak Menyala', pengadu: 'Nora Keselamatan', keutamaan: 'sederhana', status: 'selesai', tarikh: '2026-02-15', penerangan: 'Beberapa lampu kecemasan di koridor utama tidak menyala semasa ujian keselamatan bulanan.', lokasi: 'Koridor Utama, Aras 1-3', tindakan: 'Semua lampu kecemasan telah diganti dan diuji semula. Berfungsi dengan baik.' },
  { id: 5, tajuk: 'Akses Kad Pintu Rosak', pengadu: 'Ali Keselamatan', keutamaan: 'rendah', status: 'menunggu', tarikh: '2026-02-23', penerangan: 'Kad akses pintu belakang bangunan tidak berfungsi. Kakitangan perlu menggunakan pintu utama sahaja.', lokasi: 'Pintu Belakang, Aras G', tindakan: '' },
  { id: 6, tajuk: 'Komputer Server Perlahan', pengadu: 'Rizal IT', keutamaan: 'rendah', status: 'selesai', tarikh: '2026-02-10', penerangan: 'Prestasi server utama semakin perlahan menyebabkan kelewatan dalam pemprosesan data.', lokasi: 'Bilik Server, Aras 1', tindakan: 'Penambahan RAM dan pembersihan cache telah dilakukan. Prestasi kembali normal.' },
  { id: 7, tajuk: 'Kerosakan Lif Bangunan', pengadu: 'Haslinda Pentadbiran', keutamaan: 'tinggi', status: 'dalam_proses', tarikh: '2026-02-21', penerangan: 'Lif utama bangunan tersekat di aras 2 dan tidak boleh digunakan. Vendor telah dihubungi.', lokasi: 'Lif Utama', tindakan: 'Vendor dijangka tiba esok untuk pembaikan.' },
  { id: 8, tajuk: 'Kebersihan Tandas Kurang Memuaskan', pengadu: 'Farah Staf', keutamaan: 'rendah', status: 'selesai', tarikh: '2026-02-12', penerangan: 'Tandas di aras 2 kurang bersih dan perlu perhatian dari pihak pembersihan.', lokasi: 'Tandas, Aras 2', tindakan: 'Jadual pembersihan telah dikemaskini. Pemantauan berkala ditetapkan.' },
])

const tab = ref('semua')
const search = ref('')
const selectedAduan = ref<Aduan | null>(null)
const showDetailModal = ref(false)
const actionText = ref('')
const actionStatus = ref('')
const saving = ref(false)

const tabs = [
  { label: 'Semua', value: 'semua' },
  { label: 'Menunggu', value: 'menunggu' },
  { label: 'Dalam Proses', value: 'dalam_proses' },
  { label: 'Selesai', value: 'selesai' },
]

const priorityColour: Record<string, string> = {
  tinggi: 'error',
  sederhana: 'warning',
  rendah: 'neutral',
}
const priorityLabel: Record<string, string> = {
  tinggi: 'Tinggi',
  sederhana: 'Sederhana',
  rendah: 'Rendah',
}
const statusColour: Record<string, string> = {
  menunggu: 'warning',
  dalam_proses: 'info',
  selesai: 'success',
}
const statusLabel: Record<string, string> = {
  menunggu: 'Menunggu',
  dalam_proses: 'Dalam Proses',
  selesai: 'Selesai',
}

const filtered = computed(() => {
  let list = aduanList.value
  if (tab.value !== 'semua') {
    list = list.filter(a => a.status === tab.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(a =>
      a.tajuk.toLowerCase().includes(q) ||
      a.pengadu.toLowerCase().includes(q) ||
      a.lokasi.toLowerCase().includes(q),
    )
  }
  return list
})

const stats = computed(() => ({
  jumlah: aduanList.value.length,
  menunggu: aduanList.value.filter(a => a.status === 'menunggu').length,
  dalam_proses: aduanList.value.filter(a => a.status === 'dalam_proses').length,
  selesai: aduanList.value.filter(a => a.status === 'selesai').length,
}))

const columns = [
  { accessorKey: 'tajuk', header: 'Aduan' },
  { accessorKey: 'keutamaan', header: 'Keutamaan' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'tarikh', header: 'Tarikh' },
  { id: 'actions', header: '' },
]

function openDetail(aduan: Aduan) {
  selectedAduan.value = { ...aduan }
  actionText.value = aduan.tindakan
  actionStatus.value = aduan.status
  showDetailModal.value = true
}

function saveAction() {
  if (!selectedAduan.value) return
  saving.value = true
  const idx = aduanList.value.findIndex(a => a.id === selectedAduan.value!.id)
  if (idx >= 0) {
    aduanList.value[idx] = {
      ...aduanList.value[idx],
      tindakan: actionText.value,
      status: actionStatus.value as Aduan['status'],
    }
  }
  toast.add({ title: 'Berjaya', description: 'Aduan berjaya dikemaskini.', color: 'success' })
  saving.value = false
  showDetailModal.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Terima Aduan</h2>
      <p class="text-sm text-gray-500">Semak dan proses aduan yang diterima daripada kakitangan dan pengguna.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="rounded-xl border border-gray-100 bg-white p-4">
        <p class="text-xs text-gray-500">Jumlah Aduan</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.jumlah }}</p>
      </div>
      <div class="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
        <p class="text-xs text-yellow-700">Menunggu Tindakan</p>
        <p class="text-2xl font-bold text-yellow-700 mt-1">{{ stats.menunggu }}</p>
      </div>
      <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p class="text-xs text-blue-700">Sedang Diproses</p>
        <p class="text-2xl font-bold text-blue-700 mt-1">{{ stats.dalam_proses }}</p>
      </div>
      <div class="rounded-xl border border-green-100 bg-green-50 p-4">
        <p class="text-xs text-green-700">Selesai</p>
        <p class="text-2xl font-bold text-green-700 mt-1">{{ stats.selesai }}</p>
      </div>
    </div>

    <!-- Tabs & search -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div class="flex gap-1">
          <UButton
            v-for="t in tabs"
            :key="t.value"
            size="xs"
            color="neutral"
            :variant="tab === t.value ? 'solid' : 'ghost'"
            @click="tab = t.value"
          >
            {{ t.label }}
          </UButton>
        </div>
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari aduan, pengadu, lokasi..."
          class="w-64 ml-auto"
        />
      </div>

      <UTable :data="filtered" :columns="columns" hover>
        <template #tajuk-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 text-sm">{{ row.original.tajuk }}</p>
            <p class="text-xs text-gray-400">{{ row.original.pengadu }} · {{ row.original.lokasi }}</p>
          </div>
        </template>
        <template #keutamaan-cell="{ row }">
          <UBadge :color="(priorityColour[row.original.keutamaan] ?? 'neutral') as any" variant="soft" size="sm">
            {{ priorityLabel[row.original.keutamaan] ?? row.original.keutamaan }}
          </UBadge>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="(statusColour[row.original.status] ?? 'neutral') as any" variant="soft" size="sm">
            {{ statusLabel[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>
        <template #tarikh-cell="{ row }">
          <span class="text-xs text-gray-500">{{ row.original.tarikh }}</span>
        </template>
        <template #actions-cell="{ row }">
          <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-clipboard-pen" @click="openDetail(row.original)">
            Proses
          </UButton>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-500">
            <UIcon name="i-lucide-inbox" class="w-10 h-10 mx-auto mb-2" />
            <p>Tiada aduan dijumpai.</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <ClientOnly>
      <UModal v-model:open="showDetailModal">
        <template #content>
          <UCard v-if="selectedAduan">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Proses Aduan</h3>
                  <p class="text-xs text-gray-400 mt-0.5">Kemaskini tindakan dan status aduan ini.</p>
                </div>
                <UBadge :color="(priorityColour[selectedAduan.keutamaan] ?? 'neutral') as any" variant="soft" size="sm">
                  {{ priorityLabel[selectedAduan.keutamaan] }}
                </UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-xl space-y-2">
                <h4 class="font-semibold text-gray-900">{{ selectedAduan.tajuk }}</h4>
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div><span class="font-medium text-gray-700">Pengadu:</span> {{ selectedAduan.pengadu }}</div>
                  <div><span class="font-medium text-gray-700">Tarikh:</span> {{ selectedAduan.tarikh }}</div>
                  <div><span class="font-medium text-gray-700">Lokasi:</span> {{ selectedAduan.lokasi }}</div>
                  <div>
                    <span class="font-medium text-gray-700">Status semasa:</span>
                    <UBadge :color="(statusColour[selectedAduan.status] ?? 'neutral') as any" variant="soft" size="xs" class="ml-1">
                      {{ statusLabel[selectedAduan.status] }}
                    </UBadge>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-gray-600 mb-1">Penerangan Aduan</p>
                <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{{ selectedAduan.penerangan }}</p>
              </div>

              <UFormField label="Tindakan Diambil" description="Rekodkan tindakan yang telah atau akan diambil.">
                <UTextarea
                  v-model="actionText"
                  placeholder="Nyatakan tindakan yang telah atau akan diambil..."
                  :rows="3"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Kemaskini Status">
                <USelect
                  v-model="actionStatus"
                  :items="[
                    { label: 'Menunggu', value: 'menunggu' },
                    { label: 'Dalam Proses', value: 'dalam_proses' },
                    { label: 'Selesai', value: 'selesai' },
                  ]"
                  value-key="value"
                  label-key="label"
                  class="w-full"
                />
              </UFormField>
            </div>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showDetailModal = false">Tutup</UButton>
                <UButton color="neutral" icon="i-lucide-check" :loading="saving" @click="saveAction">
                  Simpan Kemaskini
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
