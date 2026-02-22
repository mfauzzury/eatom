<script setup lang="ts">
definePageMeta({ title: 'Detail Permohonan' })

const route = useRoute()
const { role, hasRole } = useAuthUser()
const toast = useToast()
const { getPermohonan, updatePermohonan } = useMockData()

const permohonan = computed(() => getPermohonan(Number(route.params.id)))

// --- Mock Document Data ---
interface MockDoc { id: number; namaFail: string; jenisDoc: string; saizFail: number }
const dokumenList = ref<MockDoc[]>([
  { id: 1, namaFail: 'Sijil_SSM_2024.pdf', jenisDoc: 'ssm', saizFail: 245000 },
  { id: 2, namaFail: 'Pelan_Tapak_Kilang.pdf', jenisDoc: 'pelan_tapak', saizFail: 1820000 }
])
const jenisDocLabel: Record<string, string> = {
  ssm: 'Sijil SSM', lesen_sedia_ada: 'Lesen Sedia Ada',
  surat_sokongan: 'Surat Sokongan', pelan_tapak: 'Pelan Tapak', lain_lain: 'Lain-lain'
}
const jenisDocOptions = [
  { label: 'Sijil SSM', value: 'ssm' },
  { label: 'Lesen Sedia Ada', value: 'lesen_sedia_ada' },
  { label: 'Surat Sokongan', value: 'surat_sokongan' },
  { label: 'Pelan Tapak', value: 'pelan_tapak' },
  { label: 'Lain-lain', value: 'lain_lain' }
]
const jenisDocUpload = ref('lain_lain')
const uploadLoading = ref(false)
const canUploadDoc = computed(() =>
  hasRole('PL', 'ADMIN') && ['draf', 'dikemukakan'].includes(permohonan.value?.status ?? '')
)

function uploadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadLoading.value = true
  setTimeout(() => {
    const maxId = Math.max(...dokumenList.value.map(d => d.id), 0)
    dokumenList.value.push({ id: maxId + 1, namaFail: file.name, jenisDoc: jenisDocUpload.value, saizFail: file.size })
    toast.add({ title: 'Berjaya', description: 'Dokumen berjaya dimuat naik (simulasi).', color: 'success' })
    uploadLoading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }, 500)
}

function deleteDoc(docId: number) {
  dokumenList.value = dokumenList.value.filter(d => d.id !== docId)
  toast.add({ title: 'Dipadam', description: 'Dokumen berjaya dipadam.', color: 'success' })
}

function downloadDoc() {
  toast.add({ title: 'Muat Turun', description: 'Simulasi muat turun dokumen.', color: 'info' })
}

// --- Mock Invoice Data ---
interface MockInvois { id: number; noInvois: string; jenisInvois: string; jumlah: number; status: string }
const invoisList = ref<MockInvois[]>([])
const invoisStatusLabel: Record<string, string> = {
  belum_bayar: 'Belum Bayar', telah_bayar: 'Telah Bayar', disahkan: 'Disahkan', batal: 'Batal'
}
const invoisStatusColor: Record<string, string> = {
  belum_bayar: 'warning', telah_bayar: 'info', disahkan: 'success', batal: 'error'
}
const showInvoisModal = ref(false)
const invoisForm = reactive({ jenisInvois: 'fee_permohonan', jumlah: 20000 })
const invoisLoading = ref(false)
const canCreateInvois = computed(() =>
  hasRole('PS', 'ADMIN') && ['semakan_PS', 'lulus_PS', 'semakan_KU'].includes(permohonan.value?.status ?? '')
)

function createInvois() {
  invoisLoading.value = true
  setTimeout(() => {
    const maxId = Math.max(...invoisList.value.map(i => i.id), 0)
    invoisList.value.push({
      id: maxId + 1,
      noInvois: `INV-${new Date().getFullYear()}-${String(maxId + 1).padStart(4, '0')}`,
      jenisInvois: invoisForm.jenisInvois,
      jumlah: invoisForm.jumlah,
      status: 'belum_bayar'
    })
    toast.add({ title: 'Berjaya', description: 'Invois berjaya dijana.', color: 'success' })
    showInvoisModal.value = false
    invoisLoading.value = false
  }, 300)
}

function invoisAction(invoisId: number, action: string) {
  const inv = invoisList.value.find(i => i.id === invoisId)
  if (!inv) return
  if (action === 'bayar') inv.status = 'telah_bayar'
  else if (action === 'sahkan') inv.status = 'disahkan'
  else if (action === 'batal') inv.status = 'batal'
  const msg = action === 'bayar' ? 'Pembayaran simulasi berjaya.' : action === 'sahkan' ? 'Pembayaran telah disahkan.' : 'Invois dibatalkan.'
  toast.add({ title: 'Berjaya', description: msg, color: 'success' })
}

// --- Mock Syarat Lesen ---
interface MockSyarat { id: number; kodSyarat: string; penerangan: string; kategori: string }
const syaratList = ref<MockSyarat[]>([])
const showSyaratModal = ref(false)
const syaratForm = reactive({ kodSyarat: '', penerangan: '', kategori: '' })
const syaratLoading = ref(false)
const canEditSyarat = computed(() =>
  hasRole('PS', 'ADMIN') && permohonan.value?.status === 'semakan_PS'
)

function addSyarat() {
  syaratLoading.value = true
  setTimeout(() => {
    const maxId = Math.max(...syaratList.value.map(s => s.id), 0)
    syaratList.value.push({
      id: maxId + 1,
      kodSyarat: syaratForm.kodSyarat,
      penerangan: syaratForm.penerangan,
      kategori: syaratForm.kategori
    })
    toast.add({ title: 'Berjaya', description: 'Syarat lesen berjaya ditambah.', color: 'success' })
    showSyaratModal.value = false
    syaratForm.kodSyarat = ''
    syaratForm.penerangan = ''
    syaratForm.kategori = ''
    syaratLoading.value = false
  }, 300)
}

function deleteSyarat(syaratId: number) {
  syaratList.value = syaratList.value.filter(s => s.id !== syaratId)
  toast.add({ title: 'Dipadam', description: 'Syarat lesen berjaya dipadam.', color: 'success' })
}

// --- Kategori Kawalan ---
const kategoriKawalanForm = reactive({ kategoriKawalan: '', catatanKategori: '' })
const kategoriLoading = ref(false)
const canSetKategori = computed(() =>
  hasRole('KU', 'ADMIN') && permohonan.value?.status === 'semakan_KU'
)

watch(() => permohonan.value, (p) => {
  if (p) {
    kategoriKawalanForm.kategoriKawalan = p.kategoriKawalan ?? ''
    kategoriKawalanForm.catatanKategori = p.catatanKategori ?? ''
  }
}, { immediate: true })

function saveKategoriKawalan() {
  kategoriLoading.value = true
  setTimeout(() => {
    updatePermohonan(Number(route.params.id), {
      kategoriKawalan: kategoriKawalanForm.kategoriKawalan,
      catatanKategori: kategoriKawalanForm.catatanKategori
    })
    toast.add({ title: 'Berjaya', description: `Kategori kawalan "${kategoriKawalanForm.kategoriKawalan}" berjaya disimpan.`, color: 'success' })
    kategoriLoading.value = false
  }, 300)
}

// --- Timeline ---
const timeline = computed(() => {
  const p = permohonan.value
  if (!p) return []
  const events: { id: number; action: string; userName: string; date: string }[] = []
  let idx = 1
  if (p.createdAt) events.push({ id: idx++, action: 'CREATE_DRAF', userName: p.createdByName || 'Pemohon', date: p.createdAt })
  if (p.submittedAt) events.push({ id: idx++, action: 'SUBMIT_PERMOHONAN', userName: p.createdByName || 'Pemohon', date: p.submittedAt })
  const status = p.status
  if (status && !['draf', 'dikemukakan'].includes(status)) {
    events.push({ id: idx++, action: 'STATUS_SEMAKAN_PS', userName: 'Pegawai Semakan', date: p.updatedAt })
  }
  if (['lulus_PS', 'semakan_KU', 'diluluskan'].includes(status)) {
    events.push({ id: idx++, action: 'STATUS_LULUS_PS', userName: 'Pegawai Semakan', date: p.updatedAt })
  }
  if (['semakan_KU', 'diluluskan'].includes(status)) {
    events.push({ id: idx++, action: 'STATUS_SEMAKAN_KU', userName: 'Ketua Unit', date: p.updatedAt })
  }
  if (status === 'diluluskan') {
    events.push({ id: idx++, action: 'STATUS_DILULUSKAN', userName: 'Ketua Unit', date: p.approvedAt || p.updatedAt })
  }
  if (status === 'ditolak') {
    events.push({ id: idx++, action: 'STATUS_DITOLAK', userName: 'Pegawai', date: p.updatedAt })
  }
  return events
})

// --- Status/Actions ---
const actionLoading = ref(false)
const showActionModal = ref(false)
const actionType = ref<'lulus' | 'tolak' | null>(null)
const catatan = ref('')

const statusColour: Record<string, string> = {
  draf: 'neutral', dikemukakan: 'info', semakan_PS: 'warning',
  lulus_PS: 'success', semakan_KU: 'warning', diluluskan: 'success', ditolak: 'error'
}
const statusLabel: Record<string, string> = {
  draf: 'Draf', dikemukakan: 'Dikemukakan', semakan_PS: 'Dalam Semakan (PS)',
  lulus_PS: 'Lulus PS', semakan_KU: 'Dalam Semakan (KU)', diluluskan: 'Diluluskan', ditolak: 'Ditolak'
}
const jenisLabel: Record<string, string> = {
  baru: 'Permohonan Baru', pinda: 'Pindaan Lesen', perbaharui: 'Pembaharuan Lesen'
}
const kategoriLesenLabel: Record<string, string> = {
  perubatan: 'Perubatan', industri: 'Industri', penyelidikan: 'Penyelidikan',
  pendidikan: 'Pendidikan', pertanian: 'Pertanian', lain_lain: 'Lain-lain'
}
const timelineActionLabel: Record<string, string> = {
  CREATE_DRAF: 'Draf Dicipta',
  SUBMIT_PERMOHONAN: 'Permohonan Dikemukakan',
  STATUS_SEMAKAN_PS: 'Semakan PS Dimulakan',
  STATUS_LULUS_PS: 'Diluluskan oleh PS',
  STATUS_SEMAKAN_KU: 'Semakan KU Dimulakan',
  STATUS_DILULUSKAN: 'Permohonan Diluluskan',
  STATUS_DITOLAK: 'Permohonan Ditolak'
}
const timelineIcons: Record<string, string> = {
  CREATE_DRAF: 'i-lucide-file-plus',
  SUBMIT_PERMOHONAN: 'i-lucide-send',
  STATUS_SEMAKAN_PS: 'i-lucide-clipboard-check',
  STATUS_LULUS_PS: 'i-lucide-check',
  STATUS_SEMAKAN_KU: 'i-lucide-clipboard-check',
  STATUS_DILULUSKAN: 'i-lucide-check-circle',
  STATUS_DITOLAK: 'i-lucide-x-circle'
}

function formatCurrency(sen: number) {
  return `RM ${(sen / 100).toFixed(2)}`
}

const canSubmitDraf = computed(() =>
  hasRole('PL', 'ADMIN') && permohonan.value?.status === 'draf'
)
const canClaimPS = computed(() =>
  hasRole('PS', 'ADMIN') && permohonan.value?.status === 'dikemukakan'
)
const canActPS = computed(() =>
  hasRole('PS', 'ADMIN') && permohonan.value?.status === 'semakan_PS'
)
const canClaimKU = computed(() =>
  hasRole('KU', 'ADMIN') && permohonan.value?.status === 'lulus_PS'
)
const canActKU = computed(() =>
  hasRole('KU', 'ADMIN') && permohonan.value?.status === 'semakan_KU'
)

function openAction(type: 'lulus' | 'tolak') {
  actionType.value = type
  catatan.value = ''
  showActionModal.value = true
}

function changeStatus(newStatus: string, successMsg: string) {
  actionLoading.value = true
  setTimeout(() => {
    const updates: Record<string, string> = { status: newStatus }
    if (catatan.value) {
      if (['semakan_PS', 'lulus_PS'].includes(newStatus) || (newStatus === 'ditolak' && canActPS.value)) {
        updates.catatanPS = catatan.value
      } else {
        updates.catatanKU = catatan.value
      }
    }
    if (newStatus === 'diluluskan') updates.approvedAt = new Date().toISOString().split('T')[0]
    if (newStatus === 'dikemukakan') updates.submittedAt = new Date().toISOString().split('T')[0]
    updatePermohonan(Number(route.params.id), updates)
    toast.add({ title: 'Berjaya', description: successMsg, color: 'success' })
    showActionModal.value = false
    actionLoading.value = false
  }, 300)
}

function submitDraf() {
  if (!permohonan.value) return
  changeStatus('dikemukakan', 'Permohonan telah dikemukakan untuk semakan.')
}

function claimSemakan() {
  if (!permohonan.value) return
  const status = canClaimPS.value ? 'semakan_PS' : 'semakan_KU'
  const msg = canClaimPS.value ? 'Semakan PS dimulakan.' : 'Semakan KU dimulakan.'
  changeStatus(status, msg)
}

function confirmAction() {
  if (!permohonan.value || !actionType.value) return
  let newStatus = ''
  if (canActPS.value) newStatus = actionType.value === 'lulus' ? 'lulus_PS' : 'ditolak'
  if (canActKU.value) newStatus = actionType.value === 'lulus' ? 'diluluskan' : 'ditolak'
  changeStatus(newStatus, `Status dikemaskini kepada: ${statusLabel[newStatus]}`)
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-4" v-if="permohonan">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <UButton to="/perlesenan/permohonan-lesen" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ permohonan.noRujukan }}</h2>
          <div class="flex items-center gap-2 mt-1">
            <UBadge :color="statusColour[permohonan.status] ?? 'neutral'" variant="subtle">
              {{ statusLabel[permohonan.status] ?? permohonan.status }}
            </UBadge>
            <span class="text-sm text-gray-500">{{ permohonan.namaSyarikat }}</span>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2">
        <UButton
          v-if="canSubmitDraf"
          :to="`/perlesenan/permohonan-lesen/${permohonan.id}/sunting`"
          icon="i-lucide-pencil"
          color="neutral"
          variant="subtle"
        >
          Sunting Draf
        </UButton>
        <UButton
          v-if="canSubmitDraf"
          icon="i-lucide-send"
          color="neutral"
          :loading="actionLoading"
          @click="submitDraf"
        >
          Kemukakan
        </UButton>
        <UButton
          v-if="canClaimPS || canClaimKU"
          icon="i-lucide-clipboard-check"
          color="warning"
          :loading="actionLoading"
          @click="claimSemakan"
        >
          Mula Semakan
        </UButton>
        <template v-if="canActPS || canActKU">
          <UButton color="error" variant="subtle" icon="i-lucide-x" @click="openAction('tolak')">Tolak</UButton>
          <UButton color="success" icon="i-lucide-check" @click="openAction('lulus')">Lulus</UButton>
        </template>
      </div>
    </div>

    <!-- Maklumat Syarikat -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Maklumat Syarikat</h3>
      </template>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt class="text-gray-500">Nama Syarikat</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.namaSyarikat }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">No. Daftar</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.noDaftar }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-gray-500">Alamat</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.alamat }}, {{ permohonan.negeri }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Telefon</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.tel || '-' }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">E-mel</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.emailSyarikat || '-' }}</dd>
        </div>
      </dl>
    </UCard>

    <!-- Maklumat Permohonan -->
    <UCard>
      <template #header>
        <h3 class="font-semibold">Maklumat Permohonan</h3>
      </template>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt class="text-gray-500">Jenis Permohonan</dt>
          <dd class="font-medium mt-0.5">{{ jenisLabel[permohonan.jenisPermohonan] ?? permohonan.jenisPermohonan }}</dd>
        </div>
        <div v-if="permohonan.noLesenSediaAda">
          <dt class="text-gray-500">No. Lesen Sedia Ada</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.noLesenSediaAda }}</dd>
        </div>
        <div v-if="permohonan.kategoriLesen">
          <dt class="text-gray-500">Kategori Lesen</dt>
          <dd class="font-medium mt-0.5">{{ kategoriLesenLabel[permohonan.kategoriLesen] ?? permohonan.kategoriLesen }}</dd>
        </div>
        <div v-if="permohonan.subKategori">
          <dt class="text-gray-500">Sub-Kategori</dt>
          <dd class="font-medium mt-0.5 capitalize">{{ permohonan.subKategori.replace(/_/g, ' ') }}</dd>
        </div>
        <div v-if="permohonan.lokasi" class="col-span-2">
          <dt class="text-gray-500">Lokasi Premis</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.lokasi }}</dd>
        </div>
        <div v-if="permohonan.aktiviti" class="col-span-2">
          <dt class="text-gray-500">Aktiviti Sinaran</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.aktiviti }}</dd>
        </div>
        <div v-if="permohonan.bilPeralatan">
          <dt class="text-gray-500">Bil. Peralatan</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.bilPeralatan }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Dikemukakan Oleh</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.createdByName || '-' }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Tarikh Kemukakan</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.submittedAt || '-' }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Tarikh Kemaskini</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.updatedAt || '-' }}</dd>
        </div>
        <div v-if="permohonan.keteranganPermohonan" class="col-span-2">
          <dt class="text-gray-500">Keterangan</dt>
          <dd class="font-medium mt-0.5">{{ permohonan.keteranganPermohonan }}</dd>
        </div>
      </dl>
    </UCard>

    <!-- Dokumen Sokongan -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Dokumen Sokongan</h3>
          <span class="text-xs text-gray-400">{{ dokumenList.length }} fail</span>
        </div>
      </template>
      <div class="space-y-3">
        <div v-if="dokumenList.length" class="divide-y divide-gray-100">
          <div v-for="doc in dokumenList" :key="doc.id" class="flex items-center justify-between py-2">
            <div class="flex items-center gap-3 cursor-pointer hover:opacity-80" @click="downloadDoc()">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900">{{ doc.namaFail }}</p>
                <p class="text-xs text-gray-400">{{ jenisDocLabel[doc.jenisDoc] ?? doc.jenisDoc }} &middot; {{ (doc.saizFail / 1024).toFixed(0) }} KB</p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <UButton icon="i-lucide-download" color="neutral" variant="ghost" size="xs" @click="downloadDoc()" />
              <UButton v-if="canUploadDoc" icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="deleteDoc(doc.id)" />
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">Tiada dokumen dimuat naik.</p>
        <div v-if="canUploadDoc" class="flex items-end gap-3 pt-3 border-t border-gray-100">
          <UFormField label="Jenis Dokumen" class="w-44">
            <USelect v-model="jenisDocUpload" :items="jenisDocOptions" class="w-full" />
          </UFormField>
          <div class="flex-1">
            <label class="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              :class="{ 'opacity-50 pointer-events-none': uploadLoading }">
              <UIcon :name="uploadLoading ? 'i-lucide-loader-2' : 'i-lucide-upload'" class="w-4 h-4 text-gray-500" :class="{ 'animate-spin': uploadLoading }" />
              <span class="text-sm text-gray-600">{{ uploadLoading ? 'Memuat naik...' : 'Pilih fail untuk dimuat naik' }}</span>
              <input type="file" class="hidden" :disabled="uploadLoading" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx" @change="uploadFile" />
            </label>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Invois & Kewangan -->
    <UCard v-if="hasRole('PS', 'KU', 'ADMIN', 'P', 'KP', 'PL')">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Invois & Kewangan</h3>
          <UButton v-if="canCreateInvois" size="xs" icon="i-lucide-plus" color="neutral" @click="showInvoisModal = true">
            Jana Invois
          </UButton>
        </div>
      </template>
      <div v-if="invoisList.length" class="divide-y divide-gray-100">
        <div v-for="inv in invoisList" :key="inv.id" class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium">{{ inv.noInvois }}</p>
            <p class="text-xs text-gray-500">{{ inv.jenisInvois === 'fee_permohonan' ? 'Fee Permohonan' : 'Fee Lesen' }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold">{{ formatCurrency(inv.jumlah) }}</span>
            <UBadge :color="invoisStatusColor[inv.status] ?? 'neutral'" variant="soft" size="sm">
              {{ invoisStatusLabel[inv.status] ?? inv.status }}
            </UBadge>
            <UButton v-if="inv.status === 'belum_bayar'" size="xs" icon="i-lucide-credit-card" color="info" variant="subtle" @click="invoisAction(inv.id, 'bayar')">
              Simulasi Bayar
            </UButton>
            <UButton v-if="hasRole('PS', 'KU', 'ADMIN') && inv.status === 'telah_bayar'" size="xs" icon="i-lucide-check" color="success" @click="invoisAction(inv.id, 'sahkan')">
              Sahkan
            </UButton>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Tiada invois lagi.</p>
    </UCard>

    <!-- Syarat Lesen -->
    <UCard v-if="hasRole('PS', 'KU', 'ADMIN', 'P', 'KP') || syaratList.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Syarat Lesen</h3>
          <UButton v-if="canEditSyarat" size="xs" icon="i-lucide-plus" color="neutral" @click="showSyaratModal = true">
            Tambah Syarat
          </UButton>
        </div>
      </template>
      <div v-if="syaratList.length" class="space-y-2">
        <div v-for="s in syaratList" :key="s.id" class="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
          <span class="text-xs font-mono text-gray-400 mt-0.5">{{ s.kodSyarat || '-' }}</span>
          <div class="flex-1">
            <p class="text-sm">{{ s.penerangan }}</p>
            <p v-if="s.kategori" class="text-xs text-gray-400 mt-0.5">Kategori: {{ s.kategori }}</p>
          </div>
          <UButton v-if="canEditSyarat" icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="deleteSyarat(s.id)" />
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">Tiada syarat lesen ditetapkan.</p>
    </UCard>

    <!-- Kategori Kawalan -->
    <UCard v-if="permohonan.kategoriKawalan || canSetKategori || hasRole('P', 'KP', 'ADMIN')">
      <template #header>
        <h3 class="font-semibold">Kategori Kawalan</h3>
      </template>
      <div v-if="canSetKategori" class="space-y-3">
        <UFormField label="Kategori Kawalan">
          <div class="flex gap-3">
            <label v-for="cat in ['A', 'B', 'C', 'D', 'E']" :key="cat"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors"
              :class="kategoriKawalanForm.kategoriKawalan === cat ? 'border-gray-900 bg-gray-50 font-semibold' : 'border-gray-200 hover:border-gray-400'">
              <input v-model="kategoriKawalanForm.kategoriKawalan" type="radio" :value="cat" class="accent-gray-900" />
              <span class="text-sm">{{ cat }}</span>
            </label>
          </div>
        </UFormField>
        <UFormField label="Catatan">
          <UTextarea v-model="kategoriKawalanForm.catatanKategori" :rows="2" placeholder="Catatan kategori kawalan..." class="w-full" />
        </UFormField>
        <div class="flex justify-end">
          <UButton color="neutral" :loading="kategoriLoading" :disabled="!kategoriKawalanForm.kategoriKawalan" @click="saveKategoriKawalan">
            Simpan Kategori
          </UButton>
        </div>
      </div>
      <div v-else class="text-sm">
        <div class="flex items-center gap-3">
          <span class="text-gray-500">Kategori:</span>
          <UBadge v-if="permohonan.kategoriKawalan" color="neutral" variant="subtle" size="lg">{{ permohonan.kategoriKawalan }}</UBadge>
          <span v-else class="text-gray-400">Belum ditetapkan</span>
        </div>
        <p v-if="permohonan.catatanKategori" class="mt-2 p-3 rounded-lg bg-gray-50 text-sm">{{ permohonan.catatanKategori }}</p>
      </div>
    </UCard>

    <!-- Catatan Pegawai -->
    <UCard v-if="permohonan.catatanPS || permohonan.catatanKU || hasRole('PS', 'KU', 'ADMIN', 'P', 'KP')">
      <template #header>
        <h3 class="font-semibold">Catatan Pegawai</h3>
      </template>
      <div class="space-y-3 text-sm">
        <div v-if="permohonan.catatanPS">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Catatan Pegawai Semakan (PS)</p>
          <p class="mt-1 p-3 rounded-lg bg-gray-50">{{ permohonan.catatanPS }}</p>
        </div>
        <div v-if="permohonan.catatanKU">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Catatan Ketua Unit (KU)</p>
          <p class="mt-1 p-3 rounded-lg bg-gray-50">{{ permohonan.catatanKU }}</p>
        </div>
        <p v-if="!permohonan.catatanPS && !permohonan.catatanKU" class="text-gray-400">Tiada catatan lagi.</p>
      </div>
    </UCard>

    <!-- Timeline -->
    <UCard v-if="timeline.length">
      <template #header>
        <h3 class="font-semibold">Garis Masa Permohonan</h3>
      </template>
      <div class="relative pl-6 space-y-4">
        <div class="absolute left-2.5 top-1 bottom-1 w-px bg-gray-200" />
        <div v-for="event in timeline" :key="event.id" class="relative">
          <div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
            <UIcon :name="timelineIcons[event.action] ?? 'i-lucide-circle'" class="w-3 h-3 text-gray-500" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ timelineActionLabel[event.action] ?? event.action }}</p>
            <p class="text-xs text-gray-500">{{ event.userName }} &middot; {{ event.date }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <ClientOnly>
    <!-- Action Modal -->
    <UModal v-model:open="showActionModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">{{ actionType === 'lulus' ? 'Luluskan Permohonan' : 'Tolak Permohonan' }}</h3>
          </template>
          <div class="space-y-3">
            <UAlert :color="actionType === 'lulus' ? 'success' : 'error'" variant="subtle"
              :icon="actionType === 'lulus' ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
              :description="`Anda akan ${actionType === 'lulus' ? 'meluluskan' : 'menolak'} permohonan ${permohonan?.noRujukan}.`" />
            <UFormField :label="actionType === 'tolak' ? 'Sebab Penolakan (wajib)' : 'Catatan (pilihan)'">
              <UTextarea v-model="catatan" :rows="3" class="w-full" placeholder="Masukkan catatan..." />
            </UFormField>
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="showActionModal = false">Batal</UButton>
              <UButton :color="actionType === 'lulus' ? 'success' : 'error'" :loading="actionLoading"
                :disabled="actionType === 'tolak' && !catatan.trim()" @click="confirmAction">
                {{ actionType === 'lulus' ? 'Lulus' : 'Tolak' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Syarat Lesen Modal -->
    <UModal v-model:open="showSyaratModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Tambah Syarat Lesen</h3>
          </template>
          <div class="space-y-3">
            <UFormField label="Kod Syarat">
              <UInput v-model="syaratForm.kodSyarat" placeholder="cth: SL-001" class="w-full" />
            </UFormField>
            <UFormField label="Penerangan Syarat" required>
              <UTextarea v-model="syaratForm.penerangan" :rows="3" placeholder="Masukkan syarat lesen..." class="w-full" />
            </UFormField>
            <UFormField label="Kategori">
              <UInput v-model="syaratForm.kategori" placeholder="cth: Keselamatan, Penyimpanan" class="w-full" />
            </UFormField>
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="showSyaratModal = false">Batal</UButton>
              <UButton color="neutral" :loading="syaratLoading" :disabled="!syaratForm.penerangan.trim()" @click="addSyarat">Tambah</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Jana Invois Modal -->
    <UModal v-model:open="showInvoisModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Jana Invois Baharu</h3>
          </template>
          <div class="space-y-3">
            <UFormField label="Jenis Invois" required>
              <USelect v-model="invoisForm.jenisInvois" :items="[
                { label: 'Fee Permohonan', value: 'fee_permohonan' },
                { label: 'Fee Lesen', value: 'fee_lesen' }
              ]" class="w-full" />
            </UFormField>
            <UFormField label="Jumlah (sen)" required>
              <UInput v-model.number="invoisForm.jumlah" type="number" :min="100" placeholder="20000" class="w-full" />
              <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(invoisForm.jumlah || 0) }}</p>
            </UFormField>
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="showInvoisModal = false">Batal</UButton>
              <UButton color="neutral" :loading="invoisLoading" :disabled="!invoisForm.jumlah || invoisForm.jumlah <= 0" @click="createInvois">Jana</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
    </ClientOnly>
  </div>
</template>
