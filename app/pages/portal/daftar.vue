<script setup lang="ts">
import { mockRegister } from '~/composables/useAuth'
definePageMeta({ layout: 'portal', title: 'Daftar Akaun' })

const { setUser } = useAuthUser()
const toast = useToast()
const loading = ref(false)
const form = reactive({ nama: '', email: '', tel: '', password: '', confirmPassword: '' })
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (!form.nama || !form.email || !form.password) {
    error.value = 'Sila lengkapkan semua medan wajib.'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Kata laluan mestilah sekurang-kurangnya 6 aksara.'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = 'Kata laluan tidak sepadan.'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 300))

  const user = mockRegister(form.nama, form.email, form.password)
  if (!user) {
    error.value = 'E-mel ini telah didaftarkan. Sila log masuk.'
    loading.value = false
    return
  }

  setUser(user)
  toast.add({ title: 'Pendaftaran Berjaya', description: 'Akaun anda telah dicipta. Sila daftarkan maklumat syarikat.', color: 'success' })
  loading.value = false
  await navigateTo('/portal/pendaftaran-syarikat')
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-atom flex items-center justify-center mx-auto mb-5">
          <UIcon name="i-lucide-user-plus" class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Daftar Akaun Baru</h1>
        <p class="text-sm text-gray-500 mt-2">Cipta akaun untuk mula membuat permohonan lesen sinaran.</p>
      </div>

      <!-- Form -->
      <UCard>
        <div class="space-y-4">
          <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-alert-circle" :description="error" />

          <UFormField label="Nama Penuh" required>
            <UInput v-model="form.nama" placeholder="cth: Ali bin Abu" class="w-full" icon="i-lucide-user" />
          </UFormField>
          <UFormField label="E-mel" required>
            <UInput v-model="form.email" type="email" placeholder="nama@syarikat.com" class="w-full" icon="i-lucide-mail" />
          </UFormField>
          <UFormField label="No. Telefon">
            <UInput v-model="form.tel" placeholder="01X-XXXXXXX" class="w-full" icon="i-lucide-phone" />
          </UFormField>
          <UFormField label="Kata Laluan" required>
            <UInput v-model="form.password" type="password" placeholder="Minimum 6 aksara" class="w-full" icon="i-lucide-lock" />
          </UFormField>
          <UFormField label="Sahkan Kata Laluan" required>
            <UInput v-model="form.confirmPassword" type="password" placeholder="Masukkan semula kata laluan" class="w-full" icon="i-lucide-lock" />
          </UFormField>

          <button
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark disabled:opacity-50 rounded-lg transition-colors"
            :disabled="!form.nama || !form.email || !form.password || loading"
            @click="handleRegister"
          >
            <UIcon v-if="!loading" name="i-lucide-user-plus" class="w-4 h-4" />
            <UIcon v-else name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            Daftar Akaun
          </button>
        </div>
      </UCard>

      <!-- Footer -->
      <p class="text-sm text-gray-500 text-center mt-6">
        Sudah ada akaun?
        <NuxtLink to="/portal/log-masuk" class="font-semibold text-atom hover:underline">Log masuk di sini</NuxtLink>
      </p>

      <!-- Info -->
      <div class="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div class="flex gap-3">
          <UIcon name="i-lucide-info" class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div class="text-xs text-gray-500 leading-relaxed">
            <p>Selepas mendaftar, anda perlu melengkapkan <strong class="text-gray-700">pendaftaran syarikat</strong> sebelum boleh membuat permohonan lesen.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
