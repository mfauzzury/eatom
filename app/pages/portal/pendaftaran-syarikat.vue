<script setup lang="ts">
import { upgradeToLesen } from '~/composables/useAuth'
definePageMeta({ layout: 'portal', title: 'Pendaftaran Syarikat' })

const { user, isLoggedIn, hasRole, setUser } = useAuthUser()
const toast = useToast()
const loading = ref(false)

// Guards
if (import.meta.client) {
  if (!isLoggedIn.value) await navigateTo('/portal/log-masuk')
  else if (hasRole('PL')) await navigateTo('/portal/permohonan')
}

const negeriOptions = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Pulau Pinang', 'Perak', 'Perlis', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'W.P. Kuala Lumpur',
  'W.P. Labuan', 'W.P. Putrajaya'
].map(n => ({ label: n, value: n }))

const form = reactive({
  namaSyarikat: '',
  noDaftar: '',
  alamat: '',
  poskod: '',
  negeri: '',
  tel: '',
  email: ''
})

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 300))

  const updated = upgradeToLesen(user.value!.id, form.namaSyarikat)
  if (updated) {
    setUser({ ...updated })
    toast.add({ title: 'Syarikat Berjaya Didaftarkan', description: 'Anda kini boleh membuat permohonan lesen.', color: 'success' })
    await navigateTo('/portal/permohonan')
  }
  loading.value = false
}
</script>

<template>
  <div class="max-w-xl mx-auto py-16">
    <!-- Progress indicator -->
    <div class="flex items-center justify-center gap-2 mb-10">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-atom-blue text-white flex items-center justify-center text-xs font-bold">
          <UIcon name="i-lucide-check" class="w-4 h-4" />
        </div>
        <span class="text-xs font-medium text-gray-900">Daftar Akaun</span>
      </div>
      <div class="w-12 h-px bg-atom-blue" />
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-atom text-white flex items-center justify-center text-xs font-bold">2</div>
        <span class="text-xs font-medium text-gray-900">Daftar Syarikat</span>
      </div>
      <div class="w-12 h-px bg-gray-200" />
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
        <span class="text-xs font-medium text-gray-400">Mohon Lesen</span>
      </div>
    </div>

    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl bg-atom flex items-center justify-center mx-auto mb-5">
        <UIcon name="i-lucide-building-2" class="w-7 h-7 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Pendaftaran Syarikat</h1>
      <p class="text-sm text-gray-500 mt-2">Daftarkan maklumat syarikat anda untuk membolehkan permohonan lesen.</p>
    </div>

    <!-- Form -->
    <UCard>
      <div class="space-y-4">
        <UFormField label="Nama Syarikat" required>
          <UInput v-model="form.namaSyarikat" placeholder="Syarikat XYZ Sdn. Bhd." class="w-full" icon="i-lucide-building-2" />
        </UFormField>
        <UFormField label="No. Pendaftaran Syarikat (SSM)" required>
          <UInput v-model="form.noDaftar" placeholder="SA-2024-XXXXX" class="w-full" icon="i-lucide-hash" />
        </UFormField>
        <UFormField label="Alamat Syarikat" required>
          <UTextarea v-model="form.alamat" placeholder="No., Jalan, Taman..." :rows="3" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Poskod">
            <UInput v-model="form.poskod" placeholder="43650" class="w-full" />
          </UFormField>
          <UFormField label="Negeri">
            <USelect v-model="form.negeri" :items="negeriOptions" placeholder="Pilih negeri" class="w-full" />
          </UFormField>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="No. Telefon Syarikat">
            <UInput v-model="form.tel" placeholder="03-XXXXXXXX" class="w-full" icon="i-lucide-phone" />
          </UFormField>
          <UFormField label="E-mel Syarikat">
            <UInput v-model="form.email" type="email" placeholder="info@syarikat.com" class="w-full" icon="i-lucide-mail" />
          </UFormField>
        </div>

        <button
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-atom hover:bg-atom-light disabled:opacity-50 rounded-lg transition-colors"
          :disabled="!form.namaSyarikat || !form.noDaftar || !form.alamat || loading"
          @click="handleSubmit"
        >
          <UIcon v-if="!loading" name="i-lucide-check" class="w-4 h-4" />
          <UIcon v-else name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          Daftar Syarikat & Teruskan
        </button>
      </div>
    </UCard>
  </div>
</template>
