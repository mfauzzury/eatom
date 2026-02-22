<script setup lang="ts">
definePageMeta({ layout: 'portal', title: 'Portal eATOM' })

const { isLoggedIn, hasRole } = useAuthUser()

const stats = [
  { value: '12,500+', label: 'Lesen Dikeluarkan', icon: 'i-lucide-file-check' },
  { value: '3,200+', label: 'Syarikat Berdaftar', icon: 'i-lucide-building-2' },
  { value: '98%', label: 'Kadar Kelulusan', icon: 'i-lucide-trending-up' },
  { value: '< 14 Hari', label: 'Purata Masa Proses', icon: 'i-lucide-clock' }
]

const services = [
  {
    icon: 'i-lucide-file-plus',
    title: 'Permohonan Lesen Baru',
    desc: 'Mohon lesen baru untuk aktiviti berkaitan sinaran mengion termasuk perubatan, industri, penyelidikan dan pendidikan.',
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    icon: 'i-lucide-file-pen-line',
    title: 'Pindaan Lesen',
    desc: 'Pinda maklumat lesen sedia ada seperti penambahan peralatan, perubahan lokasi premis atau pertukaran kakitangan.',
    color: 'bg-amber-50 text-amber-600 border-amber-100'
  },
  {
    icon: 'i-lucide-refresh-cw',
    title: 'Pembaharuan Lesen',
    desc: 'Perbaharui lesen sebelum tarikh tamat tempoh untuk memastikan operasi sinaran berterusan tanpa gangguan.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  }
]

const steps = [
  { num: '01', icon: 'i-lucide-user-plus', title: 'Daftar Akaun', desc: 'Cipta akaun portal dan daftarkan maklumat syarikat anda.' },
  { num: '02', icon: 'i-lucide-file-text', title: 'Isi Borang Permohonan', desc: 'Lengkapkan borang permohonan lesen mengikut jenis dan kategori.' },
  { num: '03', icon: 'i-lucide-upload', title: 'Muat Naik Dokumen', desc: 'Lampirkan dokumen sokongan seperti surat SSM, pelan premis dan lain-lain.' },
  { num: '04', icon: 'i-lucide-check-circle', title: 'Semakan & Kelulusan', desc: 'Pegawai akan menyemak permohonan. Anda boleh pantau status secara dalam talian.' }
]

const faqs = [
  { q: 'Siapa yang perlu memohon lesen?', a: 'Mana-mana syarikat atau organisasi yang menjalankan aktiviti melibatkan bahan sinaran mengion perlu memiliki lesen yang sah daripada Jabatan Tenaga Atom Malaysia.' },
  { q: 'Berapa lama proses kelulusan?', a: 'Kebiasaannya proses semakan dan kelulusan mengambil masa 7 hingga 14 hari bekerja, bergantung kepada kesempurnaan dokumen yang dikemukakan.' },
  { q: 'Apakah dokumen yang diperlukan?', a: 'Dokumen asas termasuk sijil pendaftaran syarikat (SSM), pelan lokasi premis, senarai peralatan sinaran, dan sijil kelayakan Pegawai Perlindungan Sinaran (RPO).' },
  { q: 'Bolehkah saya menyemak status tanpa log masuk?', a: 'Ya, anda boleh menggunakan halaman Semak Status dengan memasukkan nombor rujukan permohonan anda tanpa perlu log masuk.' }
]

const openFaq = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}
</script>

<template>
  <div class="py-8 space-y-8">
    <!-- Hero -->
    <div class="rounded-2xl bg-atom relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-atom-blue/10 blur-3xl" />
        <div class="absolute -bottom-28 -left-12 w-96 h-96 rounded-full bg-atom-light/30 blur-3xl" />
        <div class="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-atom-blue/5 blur-2xl" />
      </div>
      <div class="relative px-8 py-12 md:px-12 md:py-16">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div class="max-w-xl">
            <img src="/logo-atom.png" alt="Jabatan Tenaga Atom" class="h-8 brightness-0 invert opacity-70 mb-6" />
            <h1 class="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Portal Perkhidmatan<br />
              <span class="text-atom-blue">Perlesenan Sinaran</span>
            </h1>
            <p class="text-white/60 max-w-lg mb-8 leading-relaxed">
              Mohon, pinda dan perbaharui lesen bahan sinaran mengion secara dalam talian.
              Pantau status permohonan anda pada bila-bila masa.
            </p>
            <div class="flex flex-wrap gap-3">
              <NuxtLink
                v-if="!isLoggedIn"
                to="/portal/daftar"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-user-plus" class="w-4 h-4" />
                Daftar & Mohon Lesen
              </NuxtLink>
              <NuxtLink
                v-else-if="hasRole('AWAM')"
                to="/portal/pendaftaran-syarikat"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-building-2" class="w-4 h-4" />
                Daftar Syarikat
              </NuxtLink>
              <NuxtLink
                v-else
                to="/portal/permohonan/baru"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-file-plus" class="w-4 h-4" />
                Permohonan Baru
              </NuxtLink>
              <NuxtLink
                to="/portal/semak-status"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-search" class="w-4 h-4" />
                Semak Status
              </NuxtLink>
            </div>
          </div>
          <!-- Quick access cards (desktop) -->
          <div class="hidden lg:flex flex-col gap-3 w-56">
            <NuxtLink to="/portal/permohonan" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
              <div class="w-9 h-9 rounded-lg bg-atom-blue/20 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-file-text" class="w-4 h-4 text-atom-blue" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">Permohonan</p>
                <p class="text-[10px] text-white/50">Urus permohonan</p>
              </div>
            </NuxtLink>
            <NuxtLink to="/portal/semak-status" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
              <div class="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-search" class="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">Semak Status</p>
                <p class="text-[10px] text-white/50">Tanpa log masuk</p>
              </div>
            </NuxtLink>
            <NuxtLink to="/portal/pembayaran" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
              <div class="w-9 h-9 rounded-lg bg-blue-400/20 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-credit-card" class="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">Pembayaran</p>
                <p class="text-[10px] text-white/50">Bayar fi lesen</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-atom/5 flex items-center justify-center shrink-0">
          <UIcon :name="s.icon" class="w-5 h-5 text-atom" />
        </div>
        <div>
          <p class="text-lg font-bold text-gray-900">{{ s.value }}</p>
          <p class="text-[11px] text-gray-500">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- Services -->
    <div>
      <div class="text-center mb-8">
        <p class="text-xs font-semibold text-atom-blue uppercase tracking-widest mb-2">Perkhidmatan</p>
        <h2 class="text-2xl font-bold text-gray-900">Jenis Permohonan Lesen</h2>
        <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">Pilih jenis permohonan yang bersesuaian dengan keperluan organisasi anda.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="svc in services" :key="svc.title" class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
          <div class="w-11 h-11 rounded-lg border flex items-center justify-center mb-4" :class="svc.color">
            <UIcon :name="svc.icon" class="w-5 h-5" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">{{ svc.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed mb-4">{{ svc.desc }}</p>
          <NuxtLink
            to="/portal/daftar"
            class="inline-flex items-center gap-1 text-sm font-medium text-atom hover:text-atom-light transition-colors"
          >
            Mohon sekarang
            <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
      <div class="text-center mb-10">
        <p class="text-xs font-semibold text-atom-blue uppercase tracking-widest mb-2">Proses</p>
        <h2 class="text-2xl font-bold text-gray-900">Cara Memohon</h2>
        <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">Ikuti empat langkah mudah untuk melengkapkan permohonan lesen anda.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div v-for="(s, i) in steps" :key="s.num" class="relative">
          <div v-if="i < steps.length - 1" class="hidden md:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px border-t-2 border-dashed border-gray-200" />
          <div class="text-center relative">
            <div class="w-12 h-12 rounded-xl bg-atom text-white flex items-center justify-center mx-auto mb-3">
              <UIcon :name="s.icon" class="w-5 h-5" />
            </div>
            <span class="inline-block text-[10px] font-bold text-atom-blue tracking-wider mb-1">LANGKAH {{ s.num }}</span>
            <h3 class="font-semibold text-gray-900 text-sm mb-1">{{ s.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div>
      <div class="text-center mb-8">
        <p class="text-xs font-semibold text-atom-blue uppercase tracking-widest mb-2">Bantuan</p>
        <h2 class="text-2xl font-bold text-gray-900">Soalan Lazim</h2>
      </div>
      <div class="space-y-2">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden transition-colors"
          :class="openFaq === i ? 'border-atom/30' : ''"
        >
          <button
            class="w-full flex items-center justify-between px-5 py-4 text-left"
            @click="toggleFaq(i)"
          >
            <span class="text-sm font-medium text-gray-900">{{ faq.q }}</span>
            <UIcon
              :name="openFaq === i ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="w-4 h-4 text-gray-400 shrink-0 ml-4"
            />
          </button>
          <div v-if="openFaq === i" class="px-5 pb-4">
            <p class="text-sm text-gray-500 leading-relaxed">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="rounded-2xl bg-atom px-8 py-10 md:px-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-xl font-bold text-white mb-2">Sedia untuk memohon lesen?</h2>
          <p class="text-sm text-white/60 max-w-md">Daftar akaun percuma dan mula membuat permohonan lesen secara dalam talian hari ini.</p>
        </div>
        <div class="flex gap-3 shrink-0">
          <NuxtLink
            v-if="!isLoggedIn"
            to="/portal/daftar"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
          >
            <UIcon name="i-lucide-user-plus" class="w-4 h-4" />
            Daftar Sekarang
          </NuxtLink>
          <NuxtLink
            v-else
            to="/portal/permohonan"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-atom-blue hover:bg-atom-blue-dark rounded-lg transition-colors"
          >
            <UIcon name="i-lucide-file-text" class="w-4 h-4" />
            Permohonan Saya
          </NuxtLink>
          <NuxtLink
            to="/portal/log-masuk"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
          >
            Log Masuk
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
