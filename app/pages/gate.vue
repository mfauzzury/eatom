<script setup lang="ts">
definePageMeta({ layout: 'gate', title: 'Kod Akses' })

const config = useRuntimeConfig()
const step = ref<'pin' | 'choose'>('pin')
const digits = ref<string[]>(['', '', '', '', '', ''])
const error = ref(false)
const shake = ref(false)
const inputRefs = ref<(HTMLInputElement | null)[]>([])

function setRef(el: any, i: number) {
  inputRefs.value[i] = el as HTMLInputElement
}

function onInput(i: number) {
  const val = digits.value[i]
  if (val.length > 1) digits.value[i] = val.slice(-1)
  if (!/^\d$/.test(digits.value[i])) {
    digits.value[i] = ''
    return
  }
  if (digits.value[i] && i < 5) {
    inputRefs.value[i + 1]?.focus()
  }
  if (i === 5 && digits.value.every(d => d !== '')) {
    verify()
  }
}

function onKeydown(e: KeyboardEvent, i: number) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    inputRefs.value[i - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') ?? ''
  const nums = text.replace(/\D/g, '').slice(0, 6)
  for (let i = 0; i < 6; i++) {
    digits.value[i] = nums[i] ?? ''
  }
  if (nums.length >= 6) {
    inputRefs.value[5]?.focus()
    verify()
  } else {
    inputRefs.value[nums.length]?.focus()
  }
}

function verify() {
  const pin = digits.value.join('')
  if (pin === String(config.public.gatePin)) {
    sessionStorage.setItem('eatom_gate', 'unlocked')
    step.value = 'choose'
  } else {
    error.value = true
    shake.value = true
    setTimeout(() => {
      shake.value = false
      digits.value = ['', '', '', '', '', '']
      inputRefs.value[0]?.focus()
    }, 500)
  }
}

function handleLogout() {
  sessionStorage.removeItem('eatom_gate')
  step.value = 'pin'
  digits.value = ['', '', '', '', '', '']
  error.value = false
  nextTick(() => {
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  })
}

onMounted(() => {
  if (!config.public.gatePin) {
    navigateTo('/portal')
    return
  }
  // If already unlocked, show chooser directly
  if (sessionStorage.getItem('eatom_gate') === 'unlocked') {
    step.value = 'choose'
    return
  }
  inputRefs.value[0]?.focus()
})
</script>

<template>
  <ClientOnly>
  <!-- Step 1: PIN Entry -->
  <UCard v-if="step === 'pin'" class="shadow-2xl">
    <div class="text-center space-y-6 py-2">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Kod Akses</h2>
        <p class="text-sm text-gray-500 mt-1">Masukkan kod 6 digit untuk mengakses sistem</p>
      </div>

      <div
        class="flex justify-center gap-3"
        :class="shake ? 'animate-shake' : ''"
        @paste="onPaste"
      >
        <input
          v-for="(_, i) in 6"
          :key="i"
          :ref="(el) => setRef(el, i)"
          v-model="digits[i]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 outline-none transition-colors"
          :class="error
            ? 'border-red-400 bg-red-50 text-red-600'
            : 'border-gray-200 bg-white text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900'"
          @input="onInput(i)"
          @keydown="onKeydown($event, i)"
          @focus="error = false"
        />
      </div>

      <p v-if="error" class="text-sm text-red-500 font-medium">
        Kod tidak sah. Sila cuba semula.
      </p>
    </div>
  </UCard>

  <!-- Step 2: Choose Destination -->
  <div v-else class="space-y-6 w-full max-w-lg">
    <div class="text-center">
      <h2 class="text-lg font-semibold text-gray-900">Pilih Sistem</h2>
      <p class="text-sm text-gray-500 mt-1">Sistem ini mempunyai dua modul utama. Sila pilih untuk melihat demo.</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Portal -->
      <NuxtLink
        to="/portal"
        class="group flex flex-col items-center gap-4 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-atom hover:shadow-lg transition-all duration-200"
      >
        <div class="w-14 h-14 rounded-2xl bg-atom/10 group-hover:bg-atom flex items-center justify-center transition-colors">
          <UIcon name="i-lucide-globe" class="w-7 h-7 text-atom group-hover:text-white transition-colors" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-gray-900">Portal Awam</p>
          <p class="text-xs text-gray-500 mt-1">Portal untuk pemegang lesen & orang awam membuat permohonan dan semakan status</p>
        </div>
      </NuxtLink>

      <!-- Admin -->
      <NuxtLink
        to="/login"
        class="group flex flex-col items-center gap-4 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all duration-200"
      >
        <div class="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-colors">
          <UIcon name="i-lucide-shield-check" class="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-gray-900">Sistem Dalaman</p>
          <p class="text-xs text-gray-500 mt-1">Sistem pengurusan dalaman untuk pegawai JTA bagi semakan dan kelulusan lesen</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Disclaimer -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
      <p class="text-xs text-amber-700">
        <span class="font-semibold">Penafian:</span> Ini adalah versi mockup untuk tujuan demonstrasi sahaja. Sistem ini masih dalam pembangunan dan belum melalui ujian penuh. Data yang dipaparkan adalah data contoh.
      </p>
    </div>

    <button
      class="flex items-center gap-1.5 mx-auto text-sm text-gray-400 hover:text-gray-700 transition-colors mt-2"
      @click="handleLogout"
    >
      <UIcon name="i-lucide-log-out" class="w-3.5 h-3.5" />
      Log Keluar
    </button>
  </div>
  </ClientOnly>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
