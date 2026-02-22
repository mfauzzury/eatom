<script setup lang="ts">
definePageMeta({ title: 'Perlesenan & Kawalselia' })

const subModules = [
  { label: 'Permohonan Lesen', icon: 'i-lucide-file-text', to: '/perlesenan/permohonan-lesen' },
  { label: 'Pendaftaran', icon: 'i-lucide-clipboard', to: '/perlesenan/pendaftaran' },
  { label: 'Kebenaran', icon: 'i-lucide-check-square', to: '/perlesenan/kebenaran' },
  { label: 'Peperiksaan & Pensijilan', icon: 'i-lucide-graduation-cap', to: '/perlesenan/peperiksaan' },
  { label: 'Kawalselia', icon: 'i-lucide-shield', to: '/perlesenan/kawalselia' },
  { label: 'Kewangan', icon: 'i-lucide-banknote', to: '/perlesenan/kewangan' }
]
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Modul Sistem Perlesenan dan Kawalselia</h2>
      <p class="text-sm text-gray-500">Urus permohonan lesen, kawalselia, permit dan peperiksaan.</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <NuxtLink
        v-for="item in subModules"
        :key="item.to"
        :to="item.to"
        class="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all"
      >
        <UIcon :name="item.icon" class="w-5 h-5 text-gray-500 mb-2" />
        <p class="text-sm font-semibold">{{ item.label }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
