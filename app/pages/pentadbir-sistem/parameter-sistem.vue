<script setup lang="ts">
definePageMeta({ title: 'Parameter Sistem & Tetapan' })

const { hasRole } = useAuthUser()
if (import.meta.client && !hasRole('ADMIN')) {
  await navigateTo('/dashboard')
}

const toast = useToast()

interface SystemParam {
  id: number
  kunci: string
  nilai: string
  unit: string
  keterangan: string
  dikemaskini: string
  oleh: string
  kategori: string
}

const params = useState<SystemParam[]>('system_params', () => [
  // Had Dos
  { id: 1,  kunci: 'DOS_TAHUNAN_MAX',       nilai: '20',     unit: 'mSv/tahun',  keterangan: 'Had dos berkesan tahunan untuk pekerja sinaran',          dikemaskini: '2025-01-15', oleh: 'Ahmad Admin', kategori: 'Had Dos' },
  { id: 2,  kunci: 'DOS_MATA_MAX',           nilai: '150',    unit: 'mSv/tahun',  keterangan: 'Had dos ekivalen untuk kanta mata',                       dikemaskini: '2025-01-15', oleh: 'Ahmad Admin', kategori: 'Had Dos' },
  { id: 3,  kunci: 'DOS_KULIT_MAX',          nilai: '500',    unit: 'mSv/tahun',  keterangan: 'Had dos ekivalen untuk kulit dan anggota badan',           dikemaskini: '2025-01-15', oleh: 'Ahmad Admin', kategori: 'Had Dos' },
  { id: 4,  kunci: 'DOS_AWAM_MAX',           nilai: '1',      unit: 'mSv/tahun',  keterangan: 'Had dos untuk orang awam',                                dikemaskini: '2025-01-15', oleh: 'Ahmad Admin', kategori: 'Had Dos' },
  { id: 5,  kunci: 'AMARAN_DOS_PERATUSAN',   nilai: '75',     unit: '%',           keterangan: 'Hantar amaran apabila dos mencapai peratusan ini',         dikemaskini: '2025-03-01', oleh: 'Ahmad Admin', kategori: 'Had Dos' },
  // Sesi
  { id: 6,  kunci: 'SESI_TAMAT_MINIT',       nilai: '30',     unit: 'minit',       keterangan: 'Masa tidak aktif sebelum sesi log keluar automatik',       dikemaskini: '2025-06-10', oleh: 'Ahmad Admin', kategori: 'Sesi' },
  { id: 7,  kunci: 'PERCUBAAN_LOG_MASUK',     nilai: '5',      unit: 'percubaan',   keterangan: 'Bilangan percubaan log masuk sebelum akaun dikunci',       dikemaskini: '2025-06-10', oleh: 'Ahmad Admin', kategori: 'Sesi' },
  { id: 8,  kunci: 'KUNCI_AKAUN_MINIT',       nilai: '15',     unit: 'minit',       keterangan: 'Tempoh akaun dikunci selepas percubaan melebihi had',      dikemaskini: '2025-06-10', oleh: 'Ahmad Admin', kategori: 'Sesi' },
  // Notifikasi
  { id: 9,  kunci: 'NOTIF_LUPUT_HARI',        nilai: '30',     unit: 'hari',        keterangan: 'Hantar peringatan lesen akan luput X hari sebelum tarikh', dikemaskini: '2025-02-20', oleh: 'Ahmad Admin', kategori: 'Notifikasi' },
  { id: 10, kunci: 'NOTIF_KEDUA_HARI',        nilai: '7',      unit: 'hari',        keterangan: 'Peringatan kedua lesen akan luput',                       dikemaskini: '2025-02-20', oleh: 'Ahmad Admin', kategori: 'Notifikasi' },
  { id: 11, kunci: 'EMAIL_PENTADBIR',         nilai: 'admin@eatom.gov.my', unit: 'emel', keterangan: 'Alamat e-mel penerima notifikasi sistem',            dikemaskini: '2025-04-05', oleh: 'Ahmad Admin', kategori: 'Notifikasi' },
  // Fail
  { id: 12, kunci: 'SAIZ_FAIL_MAX_MB',        nilai: '10',     unit: 'MB',          keterangan: 'Saiz maksimum fail yang boleh dimuat naik',               dikemaskini: '2025-05-01', oleh: 'Ahmad Admin', kategori: 'Fail' },
  { id: 13, kunci: 'JENIS_FAIL_BENAR',        nilai: 'pdf,jpg,png,doc,docx,xls,xlsx', unit: 'sambungan', keterangan: 'Jenis fail yang dibenarkan untuk muat naik', dikemaskini: '2025-05-01', oleh: 'Ahmad Admin', kategori: 'Fail' },
  { id: 14, kunci: 'TEMPOH_SIMPAN_LOG_HARI',  nilai: '365',    unit: 'hari',        keterangan: 'Tempoh simpanan fail log audit sebelum diarkib',           dikemaskini: '2025-05-01', oleh: 'Ahmad Admin', kategori: 'Fail' },
  // Perlesenan
  { id: 15, kunci: 'LESEN_TEMPOH_TAHUN',      nilai: '3',      unit: 'tahun',       keterangan: 'Tempoh sah lesen standard selepas diluluskan',            dikemaskini: '2025-07-01', oleh: 'Ahmad Admin', kategori: 'Perlesenan' },
  { id: 16, kunci: 'FEE_PERMOHONAN_RM',       nilai: '200',    unit: 'RM',          keterangan: 'Fee pemprosesan permohonan lesen baru',                   dikemaskini: '2025-07-01', oleh: 'Ahmad Admin', kategori: 'Perlesenan' },
  { id: 17, kunci: 'FEE_PEMBAHARUAN_RM',      nilai: '150',    unit: 'RM',          keterangan: 'Fee pembaharuan lesen sedia ada',                         dikemaskini: '2025-07-01', oleh: 'Ahmad Admin', kategori: 'Perlesenan' },
  { id: 18, kunci: 'AUTO_TOLAK_HARI',         nilai: '90',     unit: 'hari',        keterangan: 'Tolak permohonan tidak lengkap secara automatik selepas X hari', dikemaskini: '2025-08-15', oleh: 'Ahmad Admin', kategori: 'Perlesenan' },
])

const editingId = ref<number | null>(null)
const editValue = ref('')

const categoryStyle: Record<string, string> = {
  'Had Dos':    'bg-red-50    text-red-700    border-red-100',
  'Sesi':       'bg-blue-50   text-blue-700   border-blue-100',
  'Notifikasi': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'Fail':       'bg-purple-50 text-purple-700 border-purple-100',
  'Perlesenan': 'bg-green-50  text-green-700  border-green-100',
}

const grouped = computed(() => {
  const map: Record<string, SystemParam[]> = {}
  for (const p of params.value) {
    if (!map[p.kategori]) map[p.kategori] = []
    map[p.kategori].push(p)
  }
  return map
})

function startEdit(param: SystemParam) {
  editingId.value = param.id
  editValue.value = param.nilai
}

function cancelEdit() {
  editingId.value = null
  editValue.value = ''
}

function saveEdit(id: number) {
  const idx = params.value.findIndex(p => p.id === id)
  if (idx >= 0) {
    params.value[idx] = {
      ...params.value[idx],
      nilai: editValue.value,
      dikemaskini: new Date().toISOString().slice(0, 10),
      oleh: 'Ahmad Admin',
    }
  }
  toast.add({ title: 'Berjaya', description: 'Parameter berjaya dikemaskini.', color: 'success' })
  cancelEdit()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Parameter Sistem &amp; Tetapan</h2>
      <p class="text-sm text-gray-500">Urus konfigurasi dan parameter sistem eATOM.</p>
    </div>

    <div class="space-y-5">
      <div
        v-for="(items, category) in grouped"
        :key="category"
        class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
      >
        <!-- Category header -->
        <div
          class="px-5 py-3 border-b flex items-center gap-2"
          :class="categoryStyle[category] ?? 'bg-gray-50 text-gray-700 border-gray-100'"
        >
          <h3 class="text-sm font-semibold">{{ category }}</h3>
          <span class="text-xs opacity-60">({{ items.length }} parameter)</span>
        </div>

        <!-- Parameters -->
        <div class="divide-y divide-gray-50">
          <div
            v-for="param in items"
            :key="param.id"
            class="flex items-center gap-4 px-5 py-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <code class="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{{ param.kunci }}</code>
                <span class="text-xs text-gray-400">· {{ param.unit }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ param.keterangan }}</p>
              <p class="text-xs text-gray-400 mt-1">Dikemaskini: {{ param.dikemaskini }} oleh {{ param.oleh }}</p>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <template v-if="editingId === param.id">
                <UInput
                  v-model="editValue"
                  class="w-36"
                  size="sm"
                  autofocus
                  @keyup.enter="saveEdit(param.id)"
                  @keyup.escape="cancelEdit"
                />
                <UButton size="xs" color="success" icon="i-lucide-save" @click="saveEdit(param.id)">Simpan</UButton>
                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" @click="cancelEdit" />
              </template>
              <template v-else>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900">{{ param.nilai }}</p>
                  <p class="text-xs text-gray-400">{{ param.unit }}</p>
                </div>
                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-pencil" @click="startEdit(param)">Edit</UButton>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
