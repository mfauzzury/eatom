<script setup lang="ts">
definePageMeta({ title: 'Senarai Lesen Diluluskan' })

interface Lesen {
  id: number
  noRujukan: string
  noSijil: string
  namaSyarikat: string
  kategoriLesen: string
  subKategori: string
  kategoriKawalan: string
  tarikhLulus: string
  tarikhMula: string
  tarikhTamat: string
  negeri: string
  status: string
}

const senaraiLulus = ref<Lesen[]>([
  {
    id: 1,
    noRujukan: 'PLN/2026/00001',
    noSijil: 'SL/AELB/2026/001234',
    namaSyarikat: 'MediRad Sdn. Bhd.',
    kategoriLesen: 'perubatan',
    subKategori: 'radioterapi',
    kategoriKawalan: 'B',
    tarikhLulus: '2026-01-15',
    tarikhMula: '2026-02-01',
    tarikhTamat: '2027-01-31',
    negeri: 'Selangor',
    status: 'aktif'
  },
  {
    id: 2,
    noRujukan: 'PLN/2026/00002',
    noSijil: 'SL/AELB/2026/001235',
    namaSyarikat: 'Industri Gamma Malaysia Sdn. Bhd.',
    kategoriLesen: 'industri',
    subKategori: 'radiografi_industri',
    kategoriKawalan: 'A',
    tarikhLulus: '2026-01-20',
    tarikhMula: '2026-02-01',
    tarikhTamat: '2027-01-31',
    negeri: 'Johor',
    status: 'aktif'
  },
  {
    id: 3,
    noRujukan: 'PLN/2025/00045',
    noSijil: 'SL/AELB/2025/000890',
    namaSyarikat: 'UniTech Research Lab',
    kategoriLesen: 'penyelidikan',
    subKategori: 'makmal',
    kategoriKawalan: 'C',
    tarikhLulus: '2025-06-10',
    tarikhMula: '2025-07-01',
    tarikhTamat: '2026-06-30',
    negeri: 'W.P. Kuala Lumpur',
    status: 'tamat_tempoh'
  },
  {
    id: 4,
    noRujukan: 'PLN/2026/00010',
    noSijil: 'SL/AELB/2026/001300',
    namaSyarikat: 'Hospital Pakar Selatan',
    kategoriLesen: 'perubatan',
    subKategori: 'diagnosis_xray',
    kategoriKawalan: 'D',
    tarikhLulus: '2026-02-05',
    tarikhMula: '2026-03-01',
    tarikhTamat: '2027-02-28',
    negeri: 'Melaka',
    status: 'aktif'
  }
])

const kategoriLabel: Record<string, string> = {
  perubatan: 'Perubatan', industri: 'Industri', penyelidikan: 'Penyelidikan',
  pendidikan: 'Pendidikan', pertanian: 'Pertanian', lain_lain: 'Lain-lain'
}
const statusLabel: Record<string, string> = {
  aktif: 'Aktif', tamat_tempoh: 'Tamat Tempoh', dibatalkan: 'Dibatalkan'
}
const statusColor: Record<string, string> = {
  aktif: 'success', tamat_tempoh: 'warning', dibatalkan: 'error'
}

const filterKategori = ref<string | undefined>(undefined)
const filterStatus = ref<string | undefined>(undefined)
const showSijil = ref(false)
const selectedLesen = ref<Lesen | null>(null)

const filtered = computed(() => {
  return senaraiLulus.value.filter(l => {
    if (filterKategori.value && l.kategoriLesen !== filterKategori.value) return false
    if (filterStatus.value && l.status !== filterStatus.value) return false

    return true
  })
})

const columns = [
  { accessorKey: 'noSijil', header: 'No. Sijil' },
  { accessorKey: 'namaSyarikat', header: 'Syarikat' },
  { accessorKey: 'kategoriLesen', header: 'Kategori' },
  { accessorKey: 'kategoriKawalan', header: 'Kawalan' },
  { accessorKey: 'negeri', header: 'Negeri' },
  { accessorKey: 'tarikhTamat', header: 'Tamat Tempoh' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

function openSijil(lesen: Lesen) {
  selectedLesen.value = lesen
  showSijil.value = true
}

function cetakSijil() {
  if (import.meta.client) window.print()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Senarai Lesen Diluluskan</h2>
        <p class="text-sm text-gray-500">{{ filtered.length }} lesen dijumpai</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3">
      <USelect
        v-model="filterKategori"
        :items="Object.entries(kategoriLabel).map(([v, l]) => ({ label: l, value: v }))"
        placeholder="Semua Kategori"
        class="w-48"
      />
      <USelect
        v-model="filterStatus"
        :items="Object.entries(statusLabel).map(([v, l]) => ({ label: l, value: v }))"
        placeholder="Semua Status"
        class="w-40"
      />
      <UButton v-if="filterKategori || filterStatus" color="neutral" variant="ghost" size="sm" @click="filterKategori = undefined; filterStatus = undefined">
        <UIcon name="i-lucide-x" class="w-3.5 h-3.5 mr-1" />
        Reset
      </UButton>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <UTable :data="filtered" :columns="columns">
        <template #kategoriLesen-cell="{ row }">
          {{ kategoriLabel[row.original.kategoriLesen] ?? row.original.kategoriLesen }}
        </template>
        <template #kategoriKawalan-cell="{ row }">
          <UBadge v-if="row.original.kategoriKawalan" color="neutral" variant="subtle">
            {{ row.original.kategoriKawalan }}
          </UBadge>
          <span v-else class="text-gray-400">-</span>
        </template>
        <template #tarikhTamat-cell="{ row }">
          <span :class="row.original.status === 'tamat_tempoh' ? 'text-amber-600 font-medium' : ''">
            {{ row.original.tarikhTamat }}
          </span>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColor[row.original.status] ?? 'neutral'" variant="subtle">
            {{ statusLabel[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton size="xs" icon="i-lucide-file-badge" color="neutral" variant="ghost" @click="openSijil(row.original)">
              Sijil
            </UButton>
            <UButton size="xs" icon="i-lucide-eye" color="neutral" variant="ghost" :to="`/perlesenan/permohonan-lesen/${row.original.id}`">
              Lihat
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>

  <!-- Sijil Lesen Modal (client-only to avoid SSR hydration issues) -->
  <ClientOnly>
    <UModal v-model:open="showSijil" :ui="{ width: 'max-w-2xl' }">
      <template #content>
        <UCard v-if="selectedLesen">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Sijil Lesen</h3>
              <UButton icon="i-lucide-printer" color="neutral" variant="ghost" size="sm" @click="cetakSijil">Cetak</UButton>
            </div>
          </template>

          <div class="border-2 border-gray-800 rounded-lg p-8 bg-white print:border-black">
            <div class="text-center space-y-2 mb-6">
              <p class="text-xs uppercase tracking-widest text-gray-500">Lembaga Perlesenan Tenaga Atom</p>
              <h2 class="text-2xl font-bold text-gray-900">SIJIL LESEN</h2>
              <p class="text-sm text-gray-600">Akta Tenaga Atom 1984 (Akta 304)</p>
              <div class="w-24 h-0.5 bg-gray-800 mx-auto mt-3" />
            </div>

            <div class="space-y-4 text-sm">
              <div class="flex">
                <span class="w-44 text-gray-500">No. Sijil</span>
                <span class="font-bold text-lg">{{ selectedLesen.noSijil }}</span>
              </div>
              <div class="flex">
                <span class="w-44 text-gray-500">No. Rujukan</span>
                <span class="font-medium">{{ selectedLesen.noRujukan }}</span>
              </div>
              <div class="flex">
                <span class="w-44 text-gray-500">Nama Pemegang Lesen</span>
                <span class="font-medium">{{ selectedLesen.namaSyarikat }}</span>
              </div>
              <div class="flex">
                <span class="w-44 text-gray-500">Kategori</span>
                <span class="font-medium">{{ kategoriLabel[selectedLesen.kategoriLesen] ?? selectedLesen.kategoriLesen }}</span>
              </div>
              <div class="flex">
                <span class="w-44 text-gray-500">Kategori Kawalan</span>
                <span class="font-medium">{{ selectedLesen.kategoriKawalan }}</span>
              </div>
              <div class="flex">
                <span class="w-44 text-gray-500">Negeri</span>
                <span class="font-medium">{{ selectedLesen.negeri }}</span>
              </div>

              <div class="border-t border-gray-200 pt-4 mt-4">
                <div class="flex">
                  <span class="w-44 text-gray-500">Tarikh Kelulusan</span>
                  <span class="font-medium">{{ selectedLesen.tarikhLulus }}</span>
                </div>
                <div class="flex mt-2">
                  <span class="w-44 text-gray-500">Tempoh Sah Dari</span>
                  <span class="font-medium">{{ selectedLesen.tarikhMula }}</span>
                </div>
                <div class="flex mt-2">
                  <span class="w-44 text-gray-500">Tempoh Sah Sehingga</span>
                  <span class="font-bold">{{ selectedLesen.tarikhTamat }}</span>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6 mt-6 text-center">
                <p class="text-xs text-gray-400 mb-8">Sijil ini dikeluarkan secara elektronik dan sah tanpa tandatangan.</p>
                <div class="inline-block border-t border-gray-400 pt-2 px-12">
                  <p class="text-sm font-medium">Ketua Pengarah</p>
                  <p class="text-xs text-gray-500">Lembaga Perlesenan Tenaga Atom</p>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </ClientOnly>
</template>
