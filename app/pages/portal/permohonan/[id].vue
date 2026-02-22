<script setup lang="ts">
definePageMeta({ layout: 'portal', title: 'Detail Permohonan' })

const route = useRoute()
const { isLoggedIn } = useAuthUser()
const { getPermohonan } = useMockData()

if (import.meta.client && !isLoggedIn.value) await navigateTo('/portal/log-masuk')

const permohonan = computed(() => getPermohonan(Number(route.params.id)))

const statusColour: Record<string, string> = {
  draf: 'neutral', dikemukakan: 'info', semakan_PS: 'warning',
  lulus_PS: 'success', semakan_KU: 'warning', diluluskan: 'success', ditolak: 'error'
}
const statusLabel: Record<string, string> = {
  draf: 'Draf', dikemukakan: 'Dikemukakan', semakan_PS: 'Dalam Semakan',
  lulus_PS: 'Lulus Semakan', semakan_KU: 'Dalam Kelulusan', diluluskan: 'Diluluskan', ditolak: 'Ditolak'
}
const jenisLabel: Record<string, string> = {
  baru: 'Permohonan Baru', pinda: 'Pindaan Lesen', perbaharui: 'Pembaharuan Lesen'
}
const kategoriLesenLabel: Record<string, string> = {
  perubatan: 'Perubatan', industri: 'Industri', penyelidikan: 'Penyelidikan',
  pendidikan: 'Pendidikan', pertanian: 'Pertanian', lain_lain: 'Lain-lain'
}

const timeline = computed(() => {
  const p = permohonan.value
  if (!p) return []
  const events: { id: number; label: string; icon: string; date: string }[] = []
  let idx = 1
  if (p.createdAt) events.push({ id: idx++, label: 'Draf Dicipta', icon: 'i-lucide-file-plus', date: p.createdAt })
  if (p.submittedAt) events.push({ id: idx++, label: 'Permohonan Dikemukakan', icon: 'i-lucide-send', date: p.submittedAt })
  const s = p.status
  if (s && !['draf', 'dikemukakan'].includes(s)) events.push({ id: idx++, label: 'Semakan Dimulakan', icon: 'i-lucide-clipboard-check', date: p.updatedAt })
  if (['lulus_PS', 'semakan_KU', 'diluluskan'].includes(s)) events.push({ id: idx++, label: 'Lulus Semakan', icon: 'i-lucide-check', date: p.updatedAt })
  if (['semakan_KU', 'diluluskan'].includes(s)) events.push({ id: idx++, label: 'Dalam Kelulusan', icon: 'i-lucide-clipboard-check', date: p.updatedAt })
  if (s === 'diluluskan') events.push({ id: idx++, label: 'Permohonan Diluluskan', icon: 'i-lucide-check-circle', date: p.approvedAt || p.updatedAt })
  if (s === 'ditolak') events.push({ id: idx++, label: 'Permohonan Ditolak', icon: 'i-lucide-x-circle', date: p.updatedAt })
  return events
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-12">
    <template v-if="permohonan">
      <!-- Header -->
      <div class="flex items-start gap-3 mb-6">
        <UButton to="/portal/permohonan" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ permohonan.noRujukan }}</h1>
          <div class="flex items-center gap-2 mt-1">
            <UBadge :color="statusColour[permohonan.status] ?? 'neutral'" variant="subtle">
              {{ statusLabel[permohonan.status] ?? permohonan.status }}
            </UBadge>
            <span class="text-sm text-gray-500">{{ permohonan.namaSyarikat }}</span>
          </div>
        </div>
      </div>

      <!-- Company Info -->
      <UCard class="mb-4">
        <template #header><h3 class="font-semibold">Maklumat Syarikat</h3></template>
        <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt class="text-gray-500">Nama Syarikat</dt><dd class="font-medium mt-0.5">{{ permohonan.namaSyarikat }}</dd></div>
          <div><dt class="text-gray-500">No. Daftar</dt><dd class="font-medium mt-0.5">{{ permohonan.noDaftar }}</dd></div>
          <div class="col-span-2"><dt class="text-gray-500">Alamat</dt><dd class="font-medium mt-0.5">{{ permohonan.alamat }}, {{ permohonan.negeri }}</dd></div>
          <div><dt class="text-gray-500">Telefon</dt><dd class="font-medium mt-0.5">{{ permohonan.tel || '-' }}</dd></div>
          <div><dt class="text-gray-500">E-mel</dt><dd class="font-medium mt-0.5">{{ permohonan.emailSyarikat || '-' }}</dd></div>
        </dl>
      </UCard>

      <!-- Application Info -->
      <UCard class="mb-4">
        <template #header><h3 class="font-semibold">Maklumat Permohonan</h3></template>
        <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt class="text-gray-500">Jenis</dt><dd class="font-medium mt-0.5">{{ jenisLabel[permohonan.jenisPermohonan] ?? permohonan.jenisPermohonan }}</dd></div>
          <div v-if="permohonan.noLesenSediaAda"><dt class="text-gray-500">No. Lesen Sedia Ada</dt><dd class="font-medium mt-0.5">{{ permohonan.noLesenSediaAda }}</dd></div>
          <div v-if="permohonan.kategoriLesen"><dt class="text-gray-500">Kategori</dt><dd class="font-medium mt-0.5">{{ kategoriLesenLabel[permohonan.kategoriLesen] ?? permohonan.kategoriLesen }}</dd></div>
          <div v-if="permohonan.subKategori"><dt class="text-gray-500">Sub-Kategori</dt><dd class="font-medium mt-0.5 capitalize">{{ permohonan.subKategori.replace(/_/g, ' ') }}</dd></div>
          <div v-if="permohonan.lokasi" class="col-span-2"><dt class="text-gray-500">Lokasi Premis</dt><dd class="font-medium mt-0.5">{{ permohonan.lokasi }}</dd></div>
          <div v-if="permohonan.aktiviti" class="col-span-2"><dt class="text-gray-500">Aktiviti</dt><dd class="font-medium mt-0.5">{{ permohonan.aktiviti }}</dd></div>
          <div v-if="permohonan.bilPeralatan"><dt class="text-gray-500">Bil. Peralatan</dt><dd class="font-medium mt-0.5">{{ permohonan.bilPeralatan }}</dd></div>
          <div><dt class="text-gray-500">Tarikh Kemukakan</dt><dd class="font-medium mt-0.5">{{ permohonan.submittedAt || '-' }}</dd></div>
          <div v-if="permohonan.approvedAt"><dt class="text-gray-500">Tarikh Lulus</dt><dd class="font-medium mt-0.5">{{ permohonan.approvedAt }}</dd></div>
          <div v-if="permohonan.keteranganPermohonan" class="col-span-2"><dt class="text-gray-500">Keterangan</dt><dd class="font-medium mt-0.5">{{ permohonan.keteranganPermohonan }}</dd></div>
        </dl>
      </UCard>

      <!-- Officer Notes (read-only) -->
      <UCard v-if="permohonan.catatanPS || permohonan.catatanKU" class="mb-4">
        <template #header><h3 class="font-semibold">Catatan Pegawai</h3></template>
        <div class="space-y-3 text-sm">
          <div v-if="permohonan.catatanPS">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Pegawai Semakan</p>
            <p class="mt-1 p-3 rounded-lg bg-gray-50">{{ permohonan.catatanPS }}</p>
          </div>
          <div v-if="permohonan.catatanKU">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Ketua Unit</p>
            <p class="mt-1 p-3 rounded-lg bg-gray-50">{{ permohonan.catatanKU }}</p>
          </div>
        </div>
      </UCard>

      <!-- Timeline -->
      <UCard v-if="timeline.length">
        <template #header><h3 class="font-semibold">Garis Masa</h3></template>
        <div class="relative pl-6 space-y-4">
          <div class="absolute left-2.5 top-1 bottom-1 w-px bg-gray-200" />
          <div v-for="event in timeline" :key="event.id" class="relative">
            <div class="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
              <UIcon :name="event.icon" class="w-3 h-3 text-gray-500" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ event.label }}</p>
              <p class="text-xs text-gray-500">{{ event.date }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </template>

    <!-- Not found -->
    <div v-else class="text-center py-16 text-gray-500">
      <UIcon name="i-lucide-file-x" class="w-12 h-12 mx-auto mb-3" />
      <p class="text-lg font-medium">Permohonan tidak dijumpai</p>
      <UButton to="/portal/permohonan" color="neutral" variant="subtle" class="mt-4">Kembali</UButton>
    </div>
  </div>
</template>
