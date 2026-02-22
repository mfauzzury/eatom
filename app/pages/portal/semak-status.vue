<script setup lang="ts">
definePageMeta({ layout: 'portal', title: 'Semak Status Permohonan' })

const { getByRujukan } = useMockData()

const rujukan = ref('')
const result = ref<ReturnType<typeof getByRujukan>>(null)
const searched = ref(false)
const loading = ref(false)

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

async function semak() {
  if (!rujukan.value.trim()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  searched.value = true
  result.value = getByRujukan(rujukan.value)
  loading.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-16">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="w-14 h-14 rounded-2xl bg-atom/10 flex items-center justify-center mx-auto mb-5">
        <UIcon name="i-lucide-search" class="w-7 h-7 text-atom" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Semak Status Permohonan</h1>
      <p class="text-sm text-gray-500 mt-2 max-w-md mx-auto">Masukkan nombor rujukan permohonan anda untuk menyemak status terkini. Tiada log masuk diperlukan.</p>
    </div>

    <!-- Search -->
    <UCard>
      <div class="space-y-5">
        <UFormField label="No. Rujukan Permohonan">
          <div class="flex gap-2">
            <UInput
              v-model="rujukan"
              placeholder="cth: PL/2025/0001"
              class="flex-1"
              size="lg"
              icon="i-lucide-hash"
              @keyup.enter="semak"
            />
            <button
              class="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-atom hover:bg-atom-light disabled:opacity-50 rounded-lg transition-colors"
              :disabled="!rujukan.trim() || loading"
              @click="semak"
            >
              <UIcon v-if="!loading" name="i-lucide-search" class="w-4 h-4" />
              <UIcon v-else name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
              Semak
            </button>
          </div>
        </UFormField>

        <!-- Result -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="searched && result" class="rounded-xl border border-gray-200 overflow-hidden">
            <!-- Status Header -->
            <div class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p class="font-bold text-gray-900 text-lg">{{ result.noRujukan }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ result.namaSyarikat }}</p>
              </div>
              <UBadge :color="statusColour[result.status] ?? 'neutral'" variant="soft" size="lg">
                {{ statusLabel[result.status] ?? result.status }}
              </UBadge>
            </div>

            <!-- Details -->
            <div class="px-5 py-4">
              <dl class="space-y-3 text-sm">
                <div class="flex gap-4">
                  <dt class="w-40 text-gray-500 shrink-0 flex items-center gap-1.5">
                    <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5" /> Jenis
                  </dt>
                  <dd class="font-medium text-gray-900">{{ jenisLabel[result.jenisPermohonan] ?? result.jenisPermohonan }}</dd>
                </div>
                <div v-if="result.kategoriLesen" class="flex gap-4">
                  <dt class="w-40 text-gray-500 shrink-0 flex items-center gap-1.5">
                    <UIcon name="i-lucide-tag" class="w-3.5 h-3.5" /> Kategori
                  </dt>
                  <dd class="font-medium text-gray-900 capitalize">{{ result.kategoriLesen.replace(/_/g, ' ') }}</dd>
                </div>
                <div class="flex gap-4">
                  <dt class="w-40 text-gray-500 shrink-0 flex items-center gap-1.5">
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" /> Tarikh Kemukakan
                  </dt>
                  <dd class="font-medium text-gray-900">{{ result.submittedAt || '-' }}</dd>
                </div>
                <div v-if="result.approvedAt" class="flex gap-4">
                  <dt class="w-40 text-gray-500 shrink-0 flex items-center gap-1.5">
                    <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" /> Tarikh Lulus
                  </dt>
                  <dd class="font-medium text-gray-900">{{ result.approvedAt }}</dd>
                </div>
                <div class="flex gap-4">
                  <dt class="w-40 text-gray-500 shrink-0 flex items-center gap-1.5">
                    <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" /> Kemaskini Terakhir
                  </dt>
                  <dd class="font-medium text-gray-900">{{ result.updatedAt }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Transition>

        <!-- Not found -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="searched && !result && !loading" class="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
            <UIcon name="i-lucide-search-x" class="w-10 h-10 text-red-300 mx-auto mb-3" />
            <p class="font-medium text-red-800">Tidak Dijumpai</p>
            <p class="text-sm text-red-600 mt-1">Tiada permohonan dengan nombor rujukan tersebut. Sila semak semula.</p>
          </div>
        </Transition>
      </div>
    </UCard>

    <!-- Help text -->
    <div class="mt-8 text-center">
      <p class="text-xs text-gray-400">
        Contoh nombor rujukan: <span class="font-mono">PL/2025/0001</span>, <span class="font-mono">PL/2025/0007</span>
      </p>
      <p class="text-xs text-gray-400 mt-2">
        Perlu bantuan?
        <NuxtLink to="/portal/daftar" class="text-gray-600 hover:underline">Daftar akaun</NuxtLink>
        untuk mengurus permohonan anda secara dalam talian.
      </p>
    </div>
  </div>
</template>
