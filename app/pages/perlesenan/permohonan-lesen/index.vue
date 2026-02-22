<script setup lang="ts">
definePageMeta({ title: 'Senarai Permohonan Lesen' })

const { role, hasRole } = useAuthUser()
const { getFiltered } = useMockData()

const search = ref('')
const statusFilter = ref('')

const filteredData = computed(() => getFiltered(search.value || undefined, statusFilter.value || undefined))

const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Draf', value: 'draf' },
  { label: 'Dikemukakan', value: 'dikemukakan' },
  { label: 'Dalam Semakan (PS)', value: 'semakan_PS' },
  { label: 'Lulus PS', value: 'lulus_PS' },
  { label: 'Dalam Semakan (KU)', value: 'semakan_KU' },
  { label: 'Diluluskan', value: 'diluluskan' },
  { label: 'Ditolak', value: 'ditolak' }
]

const statusColour: Record<string, string> = {
  draf: 'neutral',
  dikemukakan: 'info',
  semakan_PS: 'warning',
  lulus_PS: 'success',
  semakan_KU: 'warning',
  diluluskan: 'success',
  ditolak: 'error'
}

const statusLabel: Record<string, string> = {
  draf: 'Draf',
  dikemukakan: 'Dikemukakan',
  semakan_PS: 'Dalam Semakan (PS)',
  lulus_PS: 'Lulus PS',
  semakan_KU: 'Dalam Semakan (KU)',
  diluluskan: 'Diluluskan',
  ditolak: 'Ditolak'
}

const jenisLabel: Record<string, string> = {
  baru: 'Baru', pinda: 'Pindaan', perbaharui: 'Pembaharuan'
}

const columns = [
  { accessorKey: 'noRujukan', header: 'No. Rujukan' },
  { accessorKey: 'namaSyarikat', header: 'Syarikat' },
  { accessorKey: 'jenisPermohonan', header: 'Jenis' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'updatedAt', header: 'Kemaskini' },
  { id: 'actions', header: '' }
]
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Permohonan Lesen</h2>
        <p class="text-sm text-gray-500">
          <span v-if="hasRole('PS')">Permohonan menunggu semakan anda</span>
          <span v-else-if="hasRole('KU')">Permohonan telah diluluskan PS, menunggu kelulusan anda</span>
          <span v-else>Semua permohonan lesen</span>
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          to="/perlesenan/permohonan-lesen/lulus"
          icon="i-lucide-file-badge"
          color="neutral"
          variant="subtle"
          label="Senarai Lulus"
        />
        <UButton
          v-if="hasRole('PL', 'ADMIN')"
          to="/perlesenan/permohonan-lesen/baru"
          icon="i-lucide-plus"
          color="neutral"
          label="Permohonan Baru"
        />
      </div>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="flex flex-wrap gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari no. rujukan atau syarikat..."
          class="w-64"
        />
        <USelect
          v-if="hasRole('ADMIN', 'P', 'KP')"
          v-model="statusFilter"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Semua Status"
          class="w-44"
        />
      </div>
    </UCard>

    <!-- Table -->
    <UCard :ui="{ body: 'p-0' }">
      <UTable
        :data="filteredData"
        :columns="columns"
        hover
      >
        <template #status-cell="{ row }">
          <UBadge
            :color="statusColour[row.original.status] ?? 'neutral'"
            variant="soft"
            size="sm"
          >
            {{ statusLabel[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>
        <template #jenisPermohonan-cell="{ row }">
          {{ jenisLabel[row.original.jenisPermohonan] ?? row.original.jenisPermohonan }}
        </template>
        <template #updatedAt-cell="{ row }">
          {{ row.original.updatedAt || '-' }}
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UButton
              v-if="row.original.status === 'draf' && hasRole('PL', 'ADMIN')"
              :to="`/perlesenan/permohonan-lesen/${row.original.id}/sunting`"
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              label="Sunting"
            />
            <UButton
              :to="`/perlesenan/permohonan-lesen/${row.original.id}`"
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="xs"
              label="Lihat"
            />
          </div>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-500">
            <UIcon name="i-lucide-inbox" class="w-10 h-10 mx-auto mb-2" />
            <p>Tiada permohonan dijumpai</p>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
