<script setup lang="ts">
definePageMeta({ title: 'Audit Trail / Log Sistem' })

const { isInternal } = useAuthUser()
if (import.meta.client && !isInternal.value) {
  await navigateTo('/dashboard')
}

interface AuditLog {
  id: number
  masa: string
  pengguna: string
  modul: string
  tindakan: string
  perihalan: string
  ip: string
  severity: 'info' | 'warning' | 'error'
}

const mockLogs = useState<AuditLog[]>('audit_logs', () => [
  { id: 1,  masa: '2026-02-24 08:02:11', pengguna: 'Ahmad Admin',      modul: 'Auth',         tindakan: 'LOGIN',    perihalan: 'Log masuk berjaya',                                      ip: '192.168.1.10', severity: 'info' },
  { id: 2,  masa: '2026-02-24 08:05:33', pengguna: 'Siti Semakan',     modul: 'Auth',         tindakan: 'LOGIN',    perihalan: 'Log masuk berjaya',                                      ip: '192.168.1.21', severity: 'info' },
  { id: 3,  masa: '2026-02-24 08:10:05', pengguna: 'Siti Semakan',     modul: 'Perlesenan',   tindakan: 'UPDATE',   perihalan: 'Status permohonan PL/2025/0007 dikemaskini ke semakan_PS', ip: '192.168.1.21', severity: 'info' },
  { id: 4,  masa: '2026-02-24 08:15:47', pengguna: 'Syarikat Atom PL', modul: 'Perlesenan',   tindakan: 'CREATE',   perihalan: 'Permohonan baru PL/2026/0013 dicipta',                   ip: '10.0.0.55',    severity: 'info' },
  { id: 5,  masa: '2026-02-24 08:22:19', pengguna: 'Siti Semakan',     modul: 'Perlesenan',   tindakan: 'APPROVE',  perihalan: 'Permohonan PL/2025/0005 diluluskan (PS)',                 ip: '192.168.1.21', severity: 'info' },
  { id: 6,  masa: '2026-02-24 08:30:00', pengguna: 'Kamal Ketua',      modul: 'Auth',         tindakan: 'LOGIN',    perihalan: 'Log masuk berjaya',                                      ip: '192.168.1.30', severity: 'info' },
  { id: 7,  masa: '2026-02-24 08:35:12', pengguna: 'Kamal Ketua',      modul: 'Perlesenan',   tindakan: 'APPROVE',  perihalan: 'Permohonan PL/2025/0003 diluluskan (KU)',                 ip: '192.168.1.30', severity: 'info' },
  { id: 8,  masa: '2026-02-24 08:40:55', pengguna: 'Ahmad Admin',      modul: 'Dokumen',      tindakan: 'UPLOAD',   perihalan: 'Fail Sijil_SSM_2024.pdf dimuat naik untuk PL/2025/0005',  ip: '192.168.1.10', severity: 'info' },
  { id: 9,  masa: '2026-02-24 08:45:30', pengguna: 'Ahmad Admin',      modul: 'Laporan',      tindakan: 'EXPORT',   perihalan: 'Laporan bulanan permohonan dieksport (Feb 2026)',         ip: '192.168.1.10', severity: 'info' },
  { id: 10, masa: '2026-02-24 09:00:01', pengguna: 'Sistem',           modul: 'Sistem',       tindakan: 'SYNC',     perihalan: 'Sinkronisasi data jadual berjaya',                        ip: '127.0.0.1',    severity: 'info' },
  { id: 11, masa: '2026-02-24 09:10:44', pengguna: 'Syarikat Atom PL', modul: 'Perlesenan',   tindakan: 'UPDATE',   perihalan: 'Draf permohonan PL/2025/0009 dikemaskini',               ip: '10.0.0.55',    severity: 'info' },
  { id: 12, masa: '2026-02-24 09:22:07', pengguna: 'Siti Semakan',     modul: 'Perlesenan',   tindakan: 'UPDATE',   perihalan: 'Status permohonan PL/2025/0006 dikemaskini ke semakan_PS', ip: '192.168.1.21', severity: 'info' },
  { id: 13, masa: '2026-02-24 09:35:58', pengguna: 'Ahmad Admin',      modul: 'Pengguna',     tindakan: 'UPDATE',   perihalan: 'Akaun pengguna ps@eatom.gov.my dikemaskini',              ip: '192.168.1.10', severity: 'warning' },
  { id: 14, masa: '2026-02-24 09:50:20', pengguna: 'unknown',          modul: 'Auth',         tindakan: 'ERROR',    perihalan: 'Cubaan log masuk gagal — kata laluan salah (3x)',         ip: '203.0.113.42', severity: 'error' },
  { id: 15, masa: '2026-02-24 10:05:33', pengguna: 'Sistem',           modul: 'Sistem',       tindakan: 'ERROR',    perihalan: 'Ralat sambungan ke perkhidmatan e-mel luaran',            ip: '127.0.0.1',    severity: 'error' },
  { id: 16, masa: '2026-02-24 10:15:10', pengguna: 'Siti Semakan',     modul: 'Dokumen',      tindakan: 'DOWNLOAD', perihalan: 'Dokumen Pelan_Tapak_Kilang.pdf dimuat turun',             ip: '192.168.1.21', severity: 'info' },
  { id: 17, masa: '2026-02-24 10:30:45', pengguna: 'Ahmad Admin',      modul: 'Perlesenan',   tindakan: 'DELETE',   perihalan: 'Draf permohonan ID 13 dipadam',                          ip: '192.168.1.10', severity: 'warning' },
  { id: 18, masa: '2026-02-24 10:45:00', pengguna: 'Kamal Ketua',      modul: 'Laporan',      tindakan: 'EXPORT',   perihalan: 'Senarai permohonan lulus dieksport ke PDF',              ip: '192.168.1.30', severity: 'info' },
  { id: 19, masa: '2026-02-24 11:00:22', pengguna: 'Syarikat Atom PL', modul: 'Perlesenan',   tindakan: 'CREATE',   perihalan: 'Permohonan pembaharuan PL/2025/0008 dikemukakan',        ip: '10.0.0.55',    severity: 'info' },
  { id: 20, masa: '2026-02-24 11:20:39', pengguna: 'Sistem',           modul: 'Sistem',       tindakan: 'SYNC',     perihalan: 'Sinkronisasi data pekerja sinaran berjaya',              ip: '127.0.0.1',    severity: 'info' },
])

const search = ref('')
const severityFilter = ref('semua')
const modulFilter = ref('semua')

const moduls = computed(() => ['semua', ...new Set(mockLogs.value.map(d => d.modul))])

const filtered = computed(() => mockLogs.value.filter(d => {
  const matchSearch = !search.value ||
    d.pengguna.toLowerCase().includes(search.value.toLowerCase()) ||
    d.perihalan.toLowerCase().includes(search.value.toLowerCase()) ||
    d.modul.toLowerCase().includes(search.value.toLowerCase())
  const matchSeverity = severityFilter.value === 'semua' || d.severity === severityFilter.value
  const matchModul = modulFilter.value === 'semua' || d.modul === modulFilter.value
  return matchSearch && matchSeverity && matchModul
}))

const actionColour: Record<string, string> = {
  LOGIN:    'text-blue-700 bg-blue-50',
  CREATE:   'text-green-700 bg-green-50',
  UPDATE:   'text-yellow-700 bg-yellow-50',
  DELETE:   'text-red-700 bg-red-50',
  DOWNLOAD: 'text-purple-700 bg-purple-50',
  APPROVE:  'text-emerald-700 bg-emerald-50',
  UPLOAD:   'text-indigo-700 bg-indigo-50',
  ERROR:    'text-red-700 bg-red-50',
  SYNC:     'text-teal-700 bg-teal-50',
  EXPORT:   'text-orange-700 bg-orange-50',
}

const severityColour: Record<string, string> = {
  info: 'info', warning: 'warning', error: 'error'
}

const severityLabel: Record<string, string> = {
  info: 'Info', warning: 'Amaran', error: 'Ralat'
}

const summary = computed(() => [
  { label: 'Jumlah Log',  value: mockLogs.value.length,                                      colour: 'text-gray-900',   bg: 'bg-gray-50',   icon: 'i-lucide-scroll-text' },
  { label: 'Info',        value: mockLogs.value.filter(d => d.severity === 'info').length,    colour: 'text-blue-600',   bg: 'bg-blue-50',   icon: 'i-lucide-info' },
  { label: 'Amaran',      value: mockLogs.value.filter(d => d.severity === 'warning').length, colour: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'i-lucide-triangle-alert' },
  { label: 'Ralat',       value: mockLogs.value.filter(d => d.severity === 'error').length,   colour: 'text-red-600',    bg: 'bg-red-50',    icon: 'i-lucide-x-circle' },
])

const columns = [
  { accessorKey: 'masa',      header: 'Masa' },
  { accessorKey: 'pengguna',  header: 'Pengguna' },
  { accessorKey: 'modul',     header: 'Modul' },
  { accessorKey: 'tindakan',  header: 'Tindakan' },
  { accessorKey: 'perihalan', header: 'Perihalan' },
  { accessorKey: 'ip',        header: 'IP' },
  { accessorKey: 'severity',  header: 'Tahap' },
]

function exportLog() {
  useToast().add({ title: 'Eksport', description: 'Log dieksport (simulasi).', color: 'info' })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Audit Trail / Log Sistem</h2>
        <p class="text-sm text-gray-500">Rekod semua aktiviti pengguna dan peristiwa sistem untuk tujuan keselamatan dan pematuhan.</p>
      </div>
      <UButton icon="i-lucide-download" color="neutral" variant="subtle" @click="exportLog">
        Eksport Log
      </UButton>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="card in summary"
        :key="card.label"
        class="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-3"
      >
        <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="card.bg">
          <UIcon :name="card.icon" class="w-5 h-5" :class="card.colour" />
        </div>
        <div>
          <p class="text-xs text-gray-500">{{ card.label }}</p>
          <p class="text-2xl font-bold leading-tight" :class="card.colour">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- Table card -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari pengguna, modul atau penerangan..."
          class="w-72"
        />
        <div class="flex items-center gap-2 ml-auto">
          <UIcon name="i-lucide-filter" class="w-4 h-4 text-gray-400" />
          <USelect
            v-model="severityFilter"
            :items="[
              { label: 'Semua Tahap', value: 'semua' },
              { label: 'Info',        value: 'info' },
              { label: 'Amaran',      value: 'warning' },
              { label: 'Ralat',       value: 'error' },
            ]"
            value-key="value"
            label-key="label"
            class="w-36"
          />
          <USelect
            v-model="modulFilter"
            :items="moduls.map(m => ({ label: m === 'semua' ? 'Semua Modul' : m, value: m }))"
            value-key="value"
            label-key="label"
            class="w-40"
          />
        </div>
      </div>

      <UTable :data="filtered" :columns="columns" hover>
        <template #masa-cell="{ row }">
          <span class="font-mono text-xs whitespace-nowrap text-gray-600">{{ row.original.masa }}</span>
        </template>
        <template #pengguna-cell="{ row }">
          <span class="text-xs font-medium text-gray-800">{{ row.original.pengguna }}</span>
        </template>
        <template #modul-cell="{ row }">
          <span class="text-xs font-medium text-gray-700">{{ row.original.modul }}</span>
        </template>
        <template #tindakan-cell="{ row }">
          <span
            class="px-2 py-0.5 rounded text-xs font-bold font-mono"
            :class="actionColour[row.original.tindakan] ?? 'text-gray-600 bg-gray-50'"
          >
            {{ row.original.tindakan }}
          </span>
        </template>
        <template #perihalan-cell="{ row }">
          <span class="text-xs text-gray-600">{{ row.original.perihalan }}</span>
        </template>
        <template #ip-cell="{ row }">
          <span class="font-mono text-xs text-gray-500">{{ row.original.ip }}</span>
        </template>
        <template #severity-cell="{ row }">
          <UBadge :color="(severityColour[row.original.severity] ?? 'neutral') as any" variant="soft" size="sm">
            {{ severityLabel[row.original.severity] ?? row.original.severity }}
          </UBadge>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-500">
            <UIcon name="i-lucide-scroll-text" class="w-10 h-10 mx-auto mb-2" />
            <p>Tiada log dijumpai.</p>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
