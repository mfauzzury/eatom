<script setup lang="ts">
import { mockLogin } from '~/composables/useAuth'
definePageMeta({ layout: 'portal', title: 'Log Masuk' })

const { setUser } = useAuthUser()
const toast = useToast()
const loading = ref(false)
const form = reactive({ email: '', password: '' })
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 300))

  const user = mockLogin(form.email, form.password || 'password123')
  if (!user) {
    error.value = 'E-mel atau kata laluan tidak sah.'
    loading.value = false
    return
  }

  // Only allow external users (PL/AWAM) via portal
  if (['ADMIN', 'PS', 'KU', 'P', 'KP'].includes(user.role)) {
    error.value = 'Akaun kakitangan dalaman — sila log masuk melalui sistem dalaman.'
    loading.value = false
    return
  }

  setUser(user)
  toast.add({ title: 'Log masuk berjaya', description: `Selamat datang, ${user.name}.`, color: 'success' })
  loading.value = false
  await navigateTo('/portal/permohonan')
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-atom flex items-center justify-center mx-auto mb-5">
          <UIcon name="i-lucide-atom" class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Log Masuk Portal</h1>
        <p class="text-sm text-gray-500 mt-2">Masuk ke akaun anda untuk mengurus permohonan lesen.</p>
      </div>

      <!-- Form -->
      <UCard>
        <div class="space-y-4">
          <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-alert-circle" :description="error" />

          <UFormField label="E-mel">
            <UInput v-model="form.email" type="email" placeholder="nama@syarikat.com" class="w-full" icon="i-lucide-mail" @keyup.enter="handleLogin" />
          </UFormField>
          <UFormField label="Kata Laluan">
            <UInput v-model="form.password" type="password" placeholder="Kata laluan" class="w-full" icon="i-lucide-lock" @keyup.enter="handleLogin" />
          </UFormField>

          <button
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-atom hover:bg-atom-light disabled:opacity-50 rounded-lg transition-colors"
            :disabled="!form.email || loading"
            @click="handleLogin"
          >
            <UIcon v-if="!loading" name="i-lucide-log-in" class="w-4 h-4" />
            <UIcon v-else name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            Log Masuk
          </button>
        </div>
      </UCard>

      <!-- Footer -->
      <p class="text-sm text-gray-500 text-center mt-6">
        Belum ada akaun?
        <NuxtLink to="/portal/daftar" class="font-semibold text-atom hover:underline">Daftar sekarang</NuxtLink>
      </p>

      <!-- Demo accounts -->
      <div class="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p class="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <UIcon name="i-lucide-test-tube" class="w-3.5 h-3.5" />
          Akaun Demo (Portal)
        </p>
        <div class="space-y-1 text-xs text-gray-500">
          <p><span class="inline-block w-10 font-medium text-gray-600">PL:</span> pl@syarikat.com</p>
          <p><span class="inline-block w-10 font-medium text-gray-600">AWAM:</span> awam@email.com</p>
          <p class="text-gray-400 mt-1">Kata laluan: apa sahaja</p>
        </div>
      </div>
    </div>
  </div>
</template>
