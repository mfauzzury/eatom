<script setup lang="ts">
definePageMeta({ layout: 'portal', title: 'Permohonan Lesen' })

const { user, isLoggedIn, hasRole } = useAuthUser()
const { permohonanList } = useMockData()

const statusColour: Record<string, string> = {
  draf: 'neutral', dikemukakan: 'info', semakan_PS: 'warning',
  lulus_PS: 'success', semakan_KU: 'warning', diluluskan: 'success', ditolak: 'error'
}
const statusLabel: Record<string, string> = {
  draf: 'Draf', dikemukakan: 'Dikemukakan', semakan_PS: 'Dalam Semakan',
  lulus_PS: 'Lulus Semakan', semakan_KU: 'Dalam Kelulusan', diluluskan: 'Diluluskan', ditolak: 'Ditolak'
}
const jenisLabel: Record<string, string> = {
  baru: 'Baru', pinda: 'Pindaan', perbaharui: 'Pembaharuan'
}

// PL: show own applications (mock: match by createdByName or show all for demo)
const myApplications = computed(() => {
  if (!isLoggedIn.value || !hasRole('PL', 'ADMIN')) return []
  return permohonanList.value.filter(p => p.createdByName === user.value?.name || p.createdByName === 'Pemohon')
})

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
  <div class="py-12">
    <!-- Not logged in -->
    <template v-if="!isLoggedIn">
      <div class="py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-lucide-file-text" class="w-8 h-8 text-gray-400" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3">Permohonan Lesen</h1>
        <p class="text-gray-500 max-w-md mx-auto mb-8">
          Untuk membuat permohonan lesen, anda perlu mendaftar akaun dan mendaftarkan maklumat syarikat terlebih dahulu.
        </p>
        <div class="flex justify-center gap-3">
          <NuxtLink to="/portal/daftar" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors">
            <UIcon name="i-lucide-user-plus" class="w-4 h-4" /> Daftar Akaun
          </NuxtLink>
          <NuxtLink to="/portal/log-masuk" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-atom border border-atom/20 hover:bg-atom/5 rounded-lg transition-colors">
            Log Masuk
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- AWAM: need company registration -->
    <template v-else-if="hasRole('AWAM')">
      <div class="py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-lucide-building-2" class="w-8 h-8 text-amber-500" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3">Satu Lagi Langkah</h1>
        <p class="text-gray-500 max-w-md mx-auto mb-8">
          Anda perlu mendaftarkan maklumat syarikat sebelum boleh membuat permohonan lesen.
        </p>
        <NuxtLink to="/portal/pendaftaran-syarikat" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom hover:bg-atom-light rounded-lg transition-colors">
          <UIcon name="i-lucide-building-2" class="w-4 h-4" /> Daftar Syarikat Sekarang
        </NuxtLink>
      </div>
    </template>

    <!-- PL: show applications -->
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Permohonan Saya</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ myApplications.length }} permohonan dijumpai</p>
        </div>
        <NuxtLink to="/portal/permohonan/baru" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors">
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Permohonan Baru
        </NuxtLink>
      </div>

      <UCard :ui="{ body: 'p-0' }">
        <UTable :data="myApplications" :columns="columns">
          <template #jenisPermohonan-cell="{ row }">
            {{ jenisLabel[row.original.jenisPermohonan] ?? row.original.jenisPermohonan }}
          </template>
          <template #status-cell="{ row }">
            <UBadge :color="statusColour[row.original.status] ?? 'neutral'" variant="soft" size="sm">
              {{ statusLabel[row.original.status] ?? row.original.status }}
            </UBadge>
          </template>
          <template #actions-cell="{ row }">
            <UButton :to="`/portal/permohonan/${row.original.id}`" icon="i-lucide-eye" color="neutral" variant="ghost" size="xs">
              Lihat
            </UButton>
          </template>
          <template #empty>
            <div class="text-center py-16 text-gray-500">
              <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-inbox" class="w-7 h-7 text-gray-300" />
              </div>
              <p class="font-medium text-gray-900 mb-1">Tiada permohonan lagi</p>
              <p class="text-sm text-gray-500 mb-4">Mulakan permohonan lesen pertama anda.</p>
              <UButton to="/portal/permohonan/baru" color="neutral" size="md">
                <UIcon name="i-lucide-plus" class="mr-1.5" /> Buat Permohonan Pertama
              </UButton>
            </div>
          </template>
        </UTable>
      </UCard>
    </template>
  </div>
</template>
