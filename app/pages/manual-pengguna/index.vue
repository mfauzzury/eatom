<script setup lang="ts">
definePageMeta({ title: 'Manual Pengguna' })

const toast = useToast()

interface Manual {
  id: number
  kategori: string
  tajuk: string
  versi: string
  tarikh: string
  saiz: string
  icon: string
}

const manuals: Manual[] = [
  { id: 1, kategori: 'Panduan Asas',      tajuk: 'Panduan Log Masuk & Navigasi Sistem eATOM',            versi: 'v1.2', tarikh: '2024-01-15', saiz: '2.1 MB', icon: 'i-lucide-book-open' },
  { id: 2, kategori: 'Panduan Asas',      tajuk: 'Pengenalan kepada Peranan & Hak Akses (RBAC)',         versi: 'v1.0', tarikh: '2024-01-15', saiz: '1.5 MB', icon: 'i-lucide-lock-keyhole' },
  { id: 3, kategori: 'Perlesenan',        tajuk: 'Panduan Permohonan Lesen Baru Secara Dalam Talian',    versi: 'v2.1', tarikh: '2024-02-01', saiz: '3.8 MB', icon: 'i-lucide-clipboard-list' },
  { id: 4, kategori: 'Perlesenan',        tajuk: 'Panduan Perbaharuan Lesen & Pindaan',                  versi: 'v1.3', tarikh: '2024-02-01', saiz: '2.9 MB', icon: 'i-lucide-refresh-cw' },
  { id: 5, kategori: 'Dos & Radiologi',   tajuk: 'Cara Memasukkan & Mengesahkan Rekod Dos Sinaran',      versi: 'v1.1', tarikh: '2024-01-20', saiz: '2.4 MB', icon: 'i-lucide-radiation' },
  { id: 6, kategori: 'Dos & Radiologi',   tajuk: 'Tafsiran Laporan Dos & Ambang Amaran',                 versi: 'v1.0', tarikh: '2024-01-20', saiz: '1.8 MB', icon: 'i-lucide-bar-chart-3' },
  { id: 7, kategori: 'Pentadbiran',       tajuk: 'Panduan Pentadbir Sistem – Pengurusan Pengguna',       versi: 'v1.4', tarikh: '2024-02-10', saiz: '4.2 MB', icon: 'i-lucide-settings' },
  { id: 8, kategori: 'Pentadbiran',       tajuk: 'Konfigurasi Parameter Sistem & Tetapan',               versi: 'v1.0', tarikh: '2024-02-10', saiz: '1.6 MB', icon: 'i-lucide-wrench' },
  { id: 9, kategori: 'Integrasi',         tajuk: 'Panduan Integrasi API & Pemantauan Gateway',           versi: 'v1.2', tarikh: '2024-01-30', saiz: '3.1 MB', icon: 'i-lucide-plug' },
]

const faqs = [
  { soal: 'Bagaimana saya boleh menetapkan semula kata laluan?',          jawapan: 'Klik "Terlupa Kata Laluan" di halaman log masuk atau hubungi Pentadbir Sistem di ext. 5001.' },
  { soal: 'Berapa lama proses kelulusan lesen mengambil masa?',           jawapan: 'Biasanya 14-21 hari bekerja bergantung kepada jenis dan kelengkapan permohonan.' },
  { soal: 'Apakah format fail yang diterima untuk muat naik dokumen?',    jawapan: 'PDF, DOCX, XLSX, dan JPEG. Saiz maksimum ialah 10MB bagi setiap fail.' },
  { soal: 'Siapa yang perlu saya hubungi jika terdapat masalah teknikal?', jawapan: 'Hubungi Meja Bantuan IT di helpdesk@atom.gov.my atau talian 03-8885 0001.' },
]

const search = ref('')
const openFaq = ref<number | null>(null)

const grouped = computed(() => {
  const map: Record<string, Manual[]> = {}
  for (const m of manuals) {
    if (search.value && !m.tajuk.toLowerCase().includes(search.value.toLowerCase())) continue
    if (!map[m.kategori]) map[m.kategori] = []
    map[m.kategori].push(m)
  }
  return map
})

function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

function simulateDownload(m: Manual) {
  toast.add({ title: 'Muat Turun', description: `Memuat turun "${m.tajuk}" (${m.saiz}) — simulasi.`, color: 'info' })
}

function simulateOpen(m: Manual) {
  toast.add({ title: 'Buka Dokumen', description: `Membuka "${m.tajuk}" — simulasi.`, color: 'info' })
}
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Manual Pengguna</h2>
      <p class="text-sm text-gray-500">Panduan penggunaan sistem eATOM untuk semua peringkat pengguna.</p>
    </div>

    <!-- Search -->
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Cari manual..."
      class="max-w-md"
    />

    <!-- Manuals grouped by category -->
    <div
      v-for="(items, kategori) in grouped"
      :key="kategori"
      class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
    >
      <div class="px-5 py-3 bg-indigo-50 border-b border-indigo-100">
        <h3 class="text-sm font-semibold text-indigo-700">{{ kategori }}</h3>
      </div>
      <div class="divide-y divide-gray-50">
        <div
          v-for="m in items"
          :key="m.id"
          class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
        >
          <div class="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <UIcon :name="m.icon" class="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">{{ m.tajuk }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ m.versi }} · Dikemaskini: {{ m.tarikh }} · {{ m.saiz }}</p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-download" @click="simulateDownload(m)">
              Muat Turun
            </UButton>
            <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-external-link" @click="simulateOpen(m)">
              Buka
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="Object.keys(grouped).length === 0" class="text-center py-10 text-gray-400">
      <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto mb-2" />
      <p>Tiada manual dijumpai untuk "{{ search }}".</p>
    </div>

    <!-- FAQ -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div class="px-5 py-3 bg-indigo-50 border-b border-indigo-100">
        <h3 class="text-sm font-semibold text-indigo-700">Soalan Lazim (FAQ)</h3>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="(faq, i) in faqs" :key="i" class="px-5">
          <button
            class="w-full flex items-center justify-between py-4 text-left gap-4"
            @click="toggleFaq(i)"
          >
            <p class="text-sm font-medium text-gray-900">{{ faq.soal }}</p>
            <UIcon
              name="i-lucide-chevron-right"
              class="w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200"
              :class="openFaq === i ? 'rotate-90' : ''"
            />
          </button>
          <p v-if="openFaq === i" class="pb-4 text-sm text-gray-600 -mt-1">
            {{ faq.jawapan }}
          </p>
        </div>
      </div>
    </div>

    <!-- Help contact banner -->
    <div class="rounded-xl p-5 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
      <p class="text-base font-semibold">Perlukan Bantuan Lanjut?</p>
      <p class="text-sm text-white/80 mt-1">Hubungi Meja Bantuan eATOM untuk sokongan teknikal dan pertanyaan penggunaan sistem.</p>
      <div class="flex items-center gap-5 mt-3 text-sm">
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-mail" class="w-4 h-4" />
          <span>helpdesk@atom.gov.my</span>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-phone" class="w-4 h-4" />
          <span>03-8885 0001 (ext. 5001)</span>
        </div>
      </div>
    </div>
  </div>
</template>
