<script setup lang="ts">
definePageMeta({ title: 'Tukar Kata Laluan' })

const toast = useToast()

const form = reactive({ lama: '', baru: '', sahkan: '' })
const show = reactive({ lama: false, baru: false, sahkan: false })
const saving = ref(false)
const success = ref(false)
const error = ref('')

const rules = [
  { label: 'Sekurang-kurangnya 8 aksara', test: (v: string) => v.length >= 8 },
  { label: 'Mengandungi huruf besar', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Mengandungi huruf kecil', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Mengandungi nombor', test: (v: string) => /\d/.test(v) },
  { label: 'Mengandungi aksara khas (@#$%^&*)', test: (v: string) => /[@#$%^&*!]/.test(v) },
]

const strength = computed(() => rules.filter(r => r.test(form.baru)).length)

const strengthLabel = computed(() => {
  if (strength.value <= 2) return 'Lemah'
  if (strength.value <= 3) return 'Sederhana'
  if (strength.value <= 4) return 'Kuat'
  return 'Sangat Kuat'
})

const strengthColor = computed(() => {
  if (strength.value <= 2) return 'bg-red-400'
  if (strength.value <= 3) return 'bg-yellow-400'
  return 'bg-green-400'
})

const mismatch = computed(() => form.sahkan.length > 0 && form.baru !== form.sahkan)

async function handleSubmit() {
  error.value = ''
  success.value = false

  if (form.lama !== 'password123') {
    error.value = 'Kata laluan semasa tidak sah.'
    return
  }
  if (form.baru !== form.sahkan) {
    error.value = 'Kata laluan baru tidak sepadan.'
    return
  }
  const failed = rules.filter(r => !r.test(form.baru))
  if (failed.length) {
    error.value = 'Kata laluan baru tidak memenuhi keperluan keselamatan.'
    return
  }

  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  success.value = true
  form.lama = ''
  form.baru = ''
  form.sahkan = ''
  toast.add({ title: 'Berjaya', description: 'Kata laluan berjaya dikemaskini.', color: 'success' })
}

function resetForm() {
  form.lama = ''
  form.baru = ''
  form.sahkan = ''
  error.value = ''
  success.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Tukar Kata Laluan</h2>
      <p class="text-sm text-gray-500">Kemaskini kata laluan akaun anda secara berkala untuk keselamatan terbaik.</p>
    </div>

    <div class="max-w-lg">
      <!-- Success banner -->
      <div v-if="success" class="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
        <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p class="text-sm font-semibold text-green-800">Kata laluan berjaya dikemaskini!</p>
          <p class="text-xs text-green-600 mt-0.5">Sila gunakan kata laluan baru anda pada log masuk seterusnya.</p>
        </div>
      </div>

      <UCard>
        <template #header>
          <div>
            <h3 class="font-semibold text-sm">Tukar Kata Laluan</h3>
            <p class="text-xs text-gray-400 mt-0.5">Masukkan kata laluan semasa dan kata laluan baru anda.</p>
          </div>
        </template>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {{ error }}
          </div>

          <!-- Kata Laluan Semasa -->
          <UFormField label="Kata Laluan Semasa" required>
            <UInput
              v-model="form.lama"
              :type="show.lama ? 'text' : 'password'"
              placeholder="Kata laluan semasa"
              class="w-full"
              :ui="{ trailing: 'pr-10' }"
            >
              <template #trailing>
                <UButton
                  :icon="show.lama ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :padded="false"
                  @click="show.lama = !show.lama"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Kata Laluan Baru -->
          <UFormField label="Kata Laluan Baru" required>
            <UInput
              v-model="form.baru"
              :type="show.baru ? 'text' : 'password'"
              placeholder="Kata laluan baru"
              class="w-full"
              :ui="{ trailing: 'pr-10' }"
            >
              <template #trailing>
                <UButton
                  :icon="show.baru ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :padded="false"
                  @click="show.baru = !show.baru"
                />
              </template>
            </UInput>
            <!-- Strength bar -->
            <div v-if="form.baru" class="mt-2 space-y-1">
              <div class="flex gap-1">
                <div
                  v-for="n in 5"
                  :key="n"
                  class="h-1.5 flex-1 rounded-full transition-colors"
                  :class="n <= strength ? strengthColor : 'bg-gray-100'"
                />
              </div>
              <p class="text-xs text-gray-500">Kekuatan: {{ strengthLabel }}</p>
            </div>
          </UFormField>

          <!-- Sahkan Kata Laluan -->
          <UFormField label="Sahkan Kata Laluan Baru" required :error="mismatch ? 'Kata laluan tidak sepadan' : undefined">
            <UInput
              v-model="form.sahkan"
              :type="show.sahkan ? 'text' : 'password'"
              placeholder="Ulang kata laluan baru"
              class="w-full"
              :ui="{ trailing: 'pr-10' }"
            >
              <template #trailing>
                <UButton
                  :icon="show.sahkan ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :padded="false"
                  @click="show.sahkan = !show.sahkan"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Password rules -->
          <div class="p-4 bg-gray-50 rounded-xl">
            <p class="text-xs font-semibold text-gray-600 mb-2">Keperluan Kata Laluan:</p>
            <ul class="space-y-1.5">
              <li v-for="r in rules" :key="r.label" class="flex items-center gap-2 text-xs">
                <div
                  class="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  :class="r.test(form.baru) ? 'bg-green-500' : 'bg-gray-200'"
                >
                  <UIcon v-if="r.test(form.baru)" name="i-lucide-check" class="w-3 h-3 text-white" />
                </div>
                <span :class="r.test(form.baru) ? 'text-green-700' : 'text-gray-500'">{{ r.label }}</span>
              </li>
            </ul>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <UButton type="button" color="neutral" variant="ghost" @click="resetForm">Batal</UButton>
            <UButton type="submit" color="neutral" icon="i-lucide-lock" :loading="saving">Simpan Kata Laluan</UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>
