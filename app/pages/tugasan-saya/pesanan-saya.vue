<script setup lang="ts">
definePageMeta({ title: 'Pesanan Saya' })

const { hasRole } = useAuthUser()
const toast = useToast()
const { permohonanList, updatePermohonan } = useMockData()

interface Tugasan {
  id: number
  refNo: string
  tajuk: string
  jenis: string
  keutamaan: string
  tarikhKemaskini: string
  status: 'menunggu' | 'dalam_proses'
  pemohon: string
  tarikh: string
  catatan: string
  permohonanStatus: string
}

const jenisLabel: Record<string, string> = {
  baru: 'Permohonan Baru', pinda: 'Pindaan Lesen', perbaharui: 'Pembaharuan Lesen'
}

const statusColour: Record<string, string> = {
  menunggu: 'warning', dalam_proses: 'info', selesai: 'success', ditolak: 'error'
}

const statusLabel: Record<string, string> = {
  semua: 'Semua', menunggu: 'Menunggu', dalam_proses: 'Dalam Proses', selesai: 'Selesai', ditolak: 'Ditolak'
}

const keutamaanColour: Record<string, string> = {
  tinggi: 'error', sederhana: 'warning', rendah: 'success'
}

const keutamaanLabel: Record<string, string> = {
  tinggi: 'Tinggi', sederhana: 'Sederhana', rendah: 'Rendah'
}

const allTugasan = computed<Tugasan[]>(() => {
  let list = permohonanList.value

  if (hasRole('PS')) {
    list = list.filter(p => ['dikemukakan', 'semakan_PS'].includes(p.status))
  } else if (hasRole('KU')) {
    list = list.filter(p => ['lulus_PS', 'semakan_KU'].includes(p.status))
  } else if (hasRole('ADMIN', 'P', 'KP')) {
    list = list.filter(p => ['dikemukakan', 'semakan_PS', 'lulus_PS', 'semakan_KU'].includes(p.status))
  } else {
    // PL / AWAM — see their own applications that need attention
    list = list.filter(p => ['draf', 'dikemukakan', 'ditolak'].includes(p.status))
  }

  return list.map(p => {
    let status: 'menunggu' | 'dalam_proses'
    if (hasRole('PL', 'AWAM')) {
      status = p.status === 'draf' ? 'menunggu' : p.status === 'ditolak' ? 'ditolak' as any : 'dalam_proses'
    } else {
      status = ['dikemukakan', 'lulus_PS'].includes(p.status) ? 'menunggu' : 'dalam_proses'
    }
    return {
      id: p.id,
      refNo: p.noRujukan,
      tajuk: `${jenisLabel[p.jenisPermohonan] ?? p.jenisPermohonan} — ${p.namaSyarikat}`,
      jenis: jenisLabel[p.jenisPermohonan] ?? p.jenisPermohonan,
      keutamaan: p.kategoriLesen === 'perubatan' ? 'tinggi' : p.kategoriLesen === 'industri' ? 'sederhana' : 'rendah',
      tarikhKemaskini: p.updatedAt,
      status,
      pemohon: p.createdByName,
      tarikh: p.submittedAt || p.createdAt,
      catatan: p.catatanPS || p.catatanKU || '',
      permohonanStatus: p.status,
    }
  })
})

const search = ref('')
const statusFilter = ref('semua')
const selected = ref<Tugasan | null>(null)
const actionLoading = ref(false)
const showModal = ref(false)
const actionType = ref<'lulus' | 'tolak' | null>(null)
const catatan = ref('')
const showActionModal = ref(false)

const filtered = computed(() => allTugasan.value.filter(t => {
  const matchSearch = !search.value ||
    t.tajuk.toLowerCase().includes(search.value.toLowerCase()) ||
    t.refNo.toLowerCase().includes(search.value.toLowerCase())
  const matchStatus = statusFilter.value === 'semua' || t.status === statusFilter.value
  return matchSearch && matchStatus
}))

const statusOptions = computed(() =>
  hasRole('PL', 'AWAM')
    ? ['semua', 'menunggu', 'dalam_proses', 'ditolak']
    : ['semua', 'menunggu', 'dalam_proses']
)

const counts = computed(() => {
  const base: Record<string, number> = { semua: allTugasan.value.length }
  for (const s of ['menunggu', 'dalam_proses', 'ditolak']) {
    base[s] = allTugasan.value.filter(t => t.status === s).length
  }
  return base
})

const columns = [
  { accessorKey: 'refNo', header: 'No. Rujukan' },
  { accessorKey: 'tajuk', header: 'Tajuk Tugasan' },
  { accessorKey: 'jenis', header: 'Jenis' },
  { accessorKey: 'keutamaan', header: 'Keutamaan' },
  { accessorKey: 'tarikhKemaskini', header: 'Tarikh Kemaskini' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' },
]

const timelineSteps = computed(() => {
  if (!selected.value) return []
  const p = permohonanList.value.find(x => x.id === selected.value!.id)
  if (!p) return []
  const s = p.status
  return [
    {
      label: 'Permohonan Diterima',
      description: 'Sistem telah menerima permohonan',
      date: p.createdAt,
      by: 'Sistem',
      done: true,
      active: false,
    },
    {
      label: 'Semakan Awal',
      description: 'Semakan kelengkapan dokumen',
      date: p.submittedAt || '-',
      by: p.createdByName,
      done: !!p.submittedAt,
      active: false,
    },
    {
      label: 'Penilaian Teknikal (PS)',
      description: 'Sedang dalam semakan Pegawai Semakan',
      date: ['semakan_PS', 'lulus_PS', 'semakan_KU', 'diluluskan', 'ditolak'].includes(s) ? p.updatedAt : '-',
      by: 'Pegawai Semakan',
      done: ['lulus_PS', 'semakan_KU', 'diluluskan'].includes(s),
      active: s === 'semakan_PS',
    },
    {
      label: 'Kelulusan Ketua Unit',
      description: 'Menunggu kelulusan Ketua Unit',
      date: ['semakan_KU', 'diluluskan'].includes(s) ? p.updatedAt : '-',
      by: 'Ketua Unit',
      done: s === 'diluluskan',
      active: s === 'semakan_KU',
    },
    {
      label: 'Keputusan Akhir',
      description: 'Keputusan akan dimaklumkan',
      date: p.approvedAt || '-',
      by: '-',
      done: s === 'diluluskan',
      active: false,
    },
  ]
})

function openDetail(row: Tugasan) {
  selected.value = row
  showModal.value = true
}

function openAction(type: 'lulus' | 'tolak') {
  actionType.value = type
  catatan.value = ''
  showActionModal.value = true
}

function applyAction(tugasan: Tugasan, action: 'lulus' | 'tolak', note = '') {
  const p = permohonanList.value.find(x => x.id === tugasan.id)
  if (!p) return

  let newStatus = ''
  if (['dikemukakan', 'semakan_PS'].includes(p.status) && hasRole('PS', 'ADMIN')) {
    newStatus = action === 'lulus' ? 'lulus_PS' : 'ditolak'
  } else if (['lulus_PS', 'semakan_KU'].includes(p.status) && hasRole('KU', 'ADMIN')) {
    newStatus = action === 'lulus' ? 'diluluskan' : 'ditolak'
  }

  if (!newStatus) return

  const extra: Record<string, string> = {}
  if (note) {
    if (hasRole('KU')) extra.catatanKU = note
    else extra.catatanPS = note
  }

  updatePermohonan(p.id, { status: newStatus, ...extra })
  toast.add({
    title: action === 'lulus' ? 'Diluluskan' : 'Ditolak',
    description: `Permohonan ${tugasan.refNo} telah ${action === 'lulus' ? 'diluluskan' : 'ditolak'}.`,
    color: action === 'lulus' ? 'success' : 'error',
  })
}

async function confirmAction() {
  if (!selected.value || !actionType.value) return
  actionLoading.value = true
  applyAction(selected.value, actionType.value, catatan.value)
  showActionModal.value = false
  showModal.value = false
  selected.value = null
  actionLoading.value = false
}

function quickAction(tugasan: Tugasan, action: 'lulus' | 'tolak') {
  applyAction(tugasan, action)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pesanan Saya</h2>
      <p class="text-sm text-gray-500">
        <span v-if="hasRole('PS')">Permohonan menunggu semakan anda</span>
        <span v-else-if="hasRole('KU')">Permohonan menunggu kelulusan anda</span>
        <span v-else-if="hasRole('PL', 'AWAM')">Senarai permohonan anda yang memerlukan tindakan</span>
        <span v-else>Semua tugasan aktif dalam sistem</span>
      </p>
    </div>

    <!-- Status pills -->
    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="s in statusOptions"
        :key="s"
        @click="statusFilter = s"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          statusFilter === s
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300',
        ]"
      >
        {{ statusLabel[s] }}
        <span v-if="counts[s] !== undefined" class="ml-1.5 opacity-70">({{ counts[s] }})</span>
      </button>
    </div>

    <!-- Filters + Table -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari tajuk / no. rujukan..."
          class="w-64"
        />
        <div class="flex items-center gap-2 ml-auto">
          <UIcon name="i-lucide-filter" class="w-4 h-4 text-gray-400" />
          <USelect
            v-model="statusFilter"
            :items="statusOptions.map(s => ({ label: statusLabel[s] ?? s, value: s }))"
            value-key="value"
            label-key="label"
            class="w-40"
          />
        </div>
      </div>

      <UTable :data="filtered" :columns="columns" hover>
        <template #refNo-cell="{ row }">
          <span class="font-mono text-indigo-700 font-semibold text-sm">{{ row.original.refNo }}</span>
        </template>
        <template #tajuk-cell="{ row }">
          <span class="text-xs leading-relaxed line-clamp-2 max-w-xs block">{{ row.original.tajuk }}</span>
        </template>
        <template #keutamaan-cell="{ row }">
          <UBadge :color="keutamaanColour[row.original.keutamaan] ?? 'neutral'" variant="soft" size="sm">
            {{ keutamaanLabel[row.original.keutamaan] ?? row.original.keutamaan }}
          </UBadge>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">
            {{ statusLabel[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-eye" @click="openDetail(row.original)">
              Lihat
            </UButton>
            <template v-if="!hasRole('PL', 'AWAM', 'P', 'KP') && (row.original.status === 'menunggu' || row.original.status === 'dalam_proses')">
              <UButton size="xs" variant="subtle" color="success" icon="i-lucide-check-circle" @click="quickAction(row.original, 'lulus')">
                Lulus
              </UButton>
              <UButton size="xs" variant="subtle" color="error" icon="i-lucide-x-circle" @click="quickAction(row.original, 'tolak')">
                Tolak
              </UButton>
            </template>
            <template v-if="hasRole('PL', 'AWAM') && row.original.permohonanStatus === 'draf'">
              <UButton size="xs" variant="subtle" color="neutral" icon="i-lucide-pencil" :to="`/perlesenan/permohonan-lesen/${row.original.id}/sunting`">
                Sunting
              </UButton>
            </template>
          </div>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-500">
            <UIcon name="i-lucide-inbox" class="w-10 h-10 mx-auto mb-2" />
            <p>Tiada tugasan dijumpai.</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <ClientOnly>
      <!-- Detail Modal -->
      <UModal v-model:open="showModal" size="lg">
        <template #content>
          <UCard v-if="selected">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Tugasan: {{ selected.refNo }}</h3>
                <UBadge :color="statusColour[selected.status] ?? 'neutral'" variant="soft">
                  {{ statusLabel[selected.status] ?? selected.status }}
                </UBadge>
              </div>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Maklumat Tugasan -->
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Maklumat Tugasan</p>
                  <dl class="space-y-2">
                    <div v-for="[k, v] in ([
                      ['No. Rujukan', selected.refNo],
                      ['Tajuk', selected.tajuk],
                      ['Jenis', selected.jenis],
                      ['Pemohon', selected.pemohon],
                      ['Tarikh Tugasan', selected.tarikh],
                      ['Tarikh Kemaskini', selected.tarikhKemaskini],
                    ] as [string, string][])" :key="k" class="flex items-start gap-2">
                      <dt class="text-xs text-gray-500 w-36 shrink-0">{{ k }}</dt>
                      <dd class="text-sm text-gray-800 font-medium">{{ v }}</dd>
                    </div>
                    <div class="flex items-start gap-2">
                      <dt class="text-xs text-gray-500 w-36 shrink-0">Keutamaan</dt>
                      <dd>
                        <UBadge :color="keutamaanColour[selected.keutamaan] ?? 'neutral'" variant="soft" size="sm">
                          {{ keutamaanLabel[selected.keutamaan] ?? selected.keutamaan }}
                        </UBadge>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div v-if="selected.catatan" class="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p class="text-xs font-semibold text-yellow-800 mb-1">Catatan</p>
                  <p class="text-sm text-yellow-700">{{ selected.catatan }}</p>
                </div>
              </div>

              <!-- Timeline -->
              <div>
                <p class="text-xs font-semibold text-gray-400 uppercase mb-3">Status Pemprosesan</p>
                <div class="relative pl-6 space-y-4">
                  <div class="absolute left-2.5 top-1 bottom-1 w-px bg-gray-200" />
                  <div v-for="(step, idx) in timelineSteps" :key="idx" class="relative">
                    <div
                      class="absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2"
                      :class="step.done ? 'bg-green-500 border-green-500' : step.active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'"
                    >
                      <UIcon
                        :name="step.done ? 'i-lucide-check' : step.active ? 'i-lucide-loader-2' : 'i-lucide-minus'"
                        class="w-3 h-3"
                        :class="step.done || step.active ? 'text-white' : 'text-gray-300'"
                      />
                    </div>
                    <div>
                      <p
                        class="text-sm font-medium"
                        :class="step.active ? 'text-indigo-700' : step.done ? 'text-gray-900' : 'text-gray-400'"
                      >
                        {{ step.label }}
                      </p>
                      <p class="text-xs text-gray-400">{{ step.description }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ step.by }} · {{ step.date }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end gap-2">
                <template v-if="!hasRole('PL', 'AWAM', 'P', 'KP') && (selected.status === 'menunggu' || selected.status === 'dalam_proses')">
                  <UButton color="error" variant="subtle" icon="i-lucide-x-circle" @click="openAction('tolak')">Tolak</UButton>
                  <UButton color="success" icon="i-lucide-check-circle" @click="openAction('lulus')">Luluskan</UButton>
                </template>
                <UButton color="neutral" variant="ghost" @click="showModal = false">Tutup</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

      <!-- Confirm Action Modal -->
      <UModal v-model:open="showActionModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">{{ actionType === 'lulus' ? 'Luluskan Tugasan' : 'Tolak Tugasan' }}</h3>
            </template>
            <div class="space-y-3">
              <UAlert
                :color="actionType === 'lulus' ? 'success' : 'error'"
                variant="subtle"
                :icon="actionType === 'lulus' ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                :description="`Anda akan ${actionType === 'lulus' ? 'meluluskan' : 'menolak'} permohonan ${selected?.refNo}.`"
              />
              <UFormField :label="actionType === 'tolak' ? 'Sebab Penolakan (wajib)' : 'Catatan (pilihan)'">
                <UTextarea v-model="catatan" :rows="3" class="w-full" placeholder="Masukkan catatan..." />
              </UFormField>
            </div>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showActionModal = false">Batal</UButton>
                <UButton
                  :color="actionType === 'lulus' ? 'success' : 'error'"
                  :loading="actionLoading"
                  :disabled="actionType === 'tolak' && !catatan.trim()"
                  @click="confirmAction"
                >
                  {{ actionType === 'lulus' ? 'Lulus' : 'Tolak' }}
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
