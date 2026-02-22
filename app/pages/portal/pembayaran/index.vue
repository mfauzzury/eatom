<script setup lang="ts">
definePageMeta({ layout: 'portal', title: 'Pembayaran' })

const { user, isLoggedIn, hasRole } = useAuthUser()
const { permohonanList } = useMockData()
const toast = useToast()

if (import.meta.client && !isLoggedIn.value) await navigateTo('/portal/log-masuk')

// Mock: applications that need payment (dikemukakan or later, not yet diluluskan)
const pendingPayment = computed(() => {
  if (!isLoggedIn.value) return []
  return permohonanList.value.filter(p =>
    ['dikemukakan', 'semakan_PS', 'lulus_PS', 'semakan_KU'].includes(p.status) &&
    (p.createdByName === user.value?.name || p.createdByName === 'Pemohon')
  )
})

const paidIds = ref<Set<number>>(new Set())

function simulateBayar(id: number, noRujukan: string) {
  paidIds.value.add(id)
  const receipt = `RES-${Date.now().toString(36).toUpperCase()}`
  toast.add({
    title: 'Pembayaran Berjaya (Simulasi)',
    description: `Rujukan resit: ${receipt} untuk permohonan ${noRujukan}`,
    color: 'success'
  })
}

const feeAmount = (kategori: string) => {
  const fees: Record<string, string> = {
    perubatan: 'RM 500.00', industri: 'RM 300.00', penyelidikan: 'RM 200.00',
    pendidikan: 'RM 150.00', pertanian: 'RM 200.00'
  }
  return fees[kategori] ?? 'RM 250.00'
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-12">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Pembayaran</h1>
      <p class="text-sm text-gray-500 mt-1">Buat pembayaran fi permohonan lesen anda.</p>
    </div>

    <template v-if="!hasRole('PL', 'ADMIN')">
      <div class="py-12 text-center">
        <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-credit-card" class="w-7 h-7 text-gray-300" />
        </div>
        <p class="font-medium text-gray-900 mb-1">Pendaftaran Syarikat Diperlukan</p>
        <p class="text-sm text-gray-500 mb-4">Sila daftar syarikat terlebih dahulu untuk membuat pembayaran.</p>
        <UButton to="/portal/pendaftaran-syarikat" color="neutral">
          <UIcon name="i-lucide-building-2" class="mr-1.5" /> Daftar Syarikat
        </UButton>
      </div>
    </template>

    <template v-else>
      <div v-if="pendingPayment.length" class="space-y-3">
        <div
          v-for="p in pendingPayment"
          :key="p.id"
          class="border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-gray-300 transition-colors"
          :class="paidIds.has(p.id) ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white'"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="paidIds.has(p.id) ? 'bg-emerald-100' : 'bg-gray-100'">
              <UIcon
                :name="paidIds.has(p.id) ? 'i-lucide-check-circle' : 'i-lucide-file-text'"
                class="w-5 h-5"
                :class="paidIds.has(p.id) ? 'text-emerald-600' : 'text-gray-500'"
              />
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ p.noRujukan }}</p>
              <p class="text-sm text-gray-500">{{ p.namaSyarikat }} — {{ p.kategoriLesen || 'Umum' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-lg font-bold text-gray-900">{{ feeAmount(p.kategoriLesen) }}</span>
            <UButton
              v-if="!paidIds.has(p.id)"
              color="neutral"
              size="md"
              @click="simulateBayar(p.id, p.noRujukan)"
            >
              <UIcon name="i-lucide-credit-card" class="mr-1.5" /> Bayar
            </UButton>
            <UBadge v-else color="success" variant="soft" size="lg">
              <UIcon name="i-lucide-check" class="mr-1" /> Dibayar
            </UBadge>
          </div>
        </div>
      </div>

      <div v-else class="py-16 text-center">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-check-circle" class="w-7 h-7 text-emerald-500" />
        </div>
        <p class="font-medium text-gray-900 mb-1">Tiada Bayaran Tertunggak</p>
        <p class="text-sm text-gray-500">Semua pembayaran telah diselesaikan.</p>
      </div>
    </template>
  </div>
</template>
