<script setup lang="ts">
definePageMeta({ title: 'Permohonan Lesen Baharu' })

const { hasRole } = useAuthUser()
if (!hasRole('PL', 'ADMIN')) await navigateTo('/perlesenan/permohonan-lesen')

const { addPermohonan } = useMockData()
const totalSteps = 3
const step = ref(1)
const loading = ref(false)
const toast = useToast()

const form = reactive({
  namaSyarikat: '',
  noDaftar: '',
  alamat: '',
  poskod: '',
  negeri: '',
  tel: '',
  email: '',
  jenisPermohonan: 'baru' as 'baru' | 'pinda' | 'perbaharui',
  noLesenSediaAda: '',
  kategoriLesen: '',
  subKategori: '',
  lokasi: '',
  aktiviti: '',
  bilPeralatan: undefined as number | undefined,
  keterangan: ''
})

const negeriOptions = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Pulau Pinang', 'Perak', 'Perlis', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'W.P. Kuala Lumpur',
  'W.P. Labuan', 'W.P. Putrajaya'
].map(n => ({ label: n, value: n }))

const jenisOptions = [
  { label: 'Permohonan Baru', value: 'baru' },
  { label: 'Pindaan Lesen', value: 'pinda' },
  { label: 'Pembaharuan Lesen', value: 'perbaharui' }
]

const kategoriOptions = [
  { label: 'Perubatan', value: 'perubatan' },
  { label: 'Industri', value: 'industri' },
  { label: 'Penyelidikan', value: 'penyelidikan' },
  { label: 'Pendidikan', value: 'pendidikan' },
  { label: 'Pertanian', value: 'pertanian' },
  { label: 'Lain-lain', value: 'lain_lain' }
]

const subKategoriMap: Record<string, { label: string; value: string }[]> = {
  perubatan: [
    { label: 'Radioterapi', value: 'radioterapi' },
    { label: 'Perubatan Nuklear', value: 'perubatan_nuklear' },
    { label: 'Diagnosis (X-ray)', value: 'diagnosis_xray' }
  ],
  industri: [
    { label: 'Radiografi Industri', value: 'radiografi_industri' },
    { label: 'Tolok Sinaran', value: 'tolok_sinaran' },
    { label: 'Well Logging', value: 'well_logging' },
    { label: 'Penyinaran Makanan', value: 'penyinaran_makanan' }
  ],
  penyelidikan: [
    { label: 'Makmal', value: 'makmal' },
    { label: 'Reaktor', value: 'reaktor' }
  ]
}

const subKategoriOptions = computed(() => subKategoriMap[form.kategoriLesen] ?? [])

const stepLabels = ['Maklumat Syarikat', 'Maklumat Permohonan', 'Semak & Hantar']

const isPindaOrPerbaharui = computed(() =>
  form.jenisPermohonan === 'pinda' || form.jenisPermohonan === 'perbaharui'
)

const kategoriLabel = computed(() =>
  kategoriOptions.find(k => k.value === form.kategoriLesen)?.label ?? form.kategoriLesen
)
const subKategoriLabel = computed(() =>
  subKategoriOptions.value.find(s => s.value === form.subKategori)?.label ?? form.subKategori
)

async function submitForm(asDraft = false) {
  loading.value = true
  await new Promise(r => setTimeout(r, 300))

  const newP = addPermohonan({
    namaSyarikat: form.namaSyarikat,
    noDaftar: form.noDaftar,
    alamat: form.alamat,
    poskod: form.poskod,
    negeri: form.negeri,
    tel: form.tel,
    emailSyarikat: form.email,
    jenisPermohonan: form.jenisPermohonan,
    noLesenSediaAda: form.noLesenSediaAda,
    kategoriLesen: form.kategoriLesen,
    subKategori: form.subKategori,
    lokasi: form.lokasi,
    aktiviti: form.aktiviti,
    bilPeralatan: form.bilPeralatan ?? null,
    keteranganPermohonan: form.keterangan,
    status: asDraft ? 'draf' : 'dikemukakan'
  })

  toast.add({
    title: asDraft ? 'Draf Disimpan' : 'Permohonan Dikemukakan',
    description: `No. Rujukan: ${newP.noRujukan}`,
    color: 'success'
  })
  loading.value = false
  await navigateTo('/perlesenan/permohonan-lesen')
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <div class="flex items-center gap-3">
      <UButton to="/perlesenan/permohonan-lesen" icon="i-lucide-arrow-left" color="neutral" variant="ghost" />
      <div>
        <h2 class="text-xl font-bold text-gray-900">Permohonan Lesen Baharu</h2>
        <p class="text-sm text-gray-500">Langkah {{ step }} daripada {{ totalSteps }} — {{ stepLabels[step - 1] }}</p>
      </div>
    </div>

    <!-- Progress -->
    <div class="flex gap-2">
      <div
        v-for="s in totalSteps"
        :key="s"
        class="h-1.5 flex-1 rounded-full transition-colors"
        :class="s <= step ? 'bg-gray-900' : 'bg-gray-200'"
      />
    </div>

    <UCard>
      <!-- Step 1: Maklumat Syarikat -->
      <template v-if="step === 1">
        <h3 class="font-semibold mb-4">Langkah 1: Maklumat Syarikat</h3>
        <div class="space-y-4">
          <UFormField label="Nama Syarikat" required>
            <UInput v-model="form.namaSyarikat" placeholder="Syarikat XYZ Sdn. Bhd." class="w-full" />
          </UFormField>
          <UFormField label="No. Daftar Syarikat (SSM)" required>
            <UInput v-model="form.noDaftar" placeholder="SA-2024-XXXXX" class="w-full" />
          </UFormField>
          <UFormField label="Alamat" required>
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
            <UFormField label="No. Telefon">
              <UInput v-model="form.tel" placeholder="03-XXXXXXXX" class="w-full" />
            </UFormField>
            <UFormField label="E-mel">
              <UInput v-model="form.email" type="email" placeholder="info@syarikat.com" class="w-full" />
            </UFormField>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <UButton color="neutral" :disabled="!form.namaSyarikat || !form.noDaftar || !form.alamat" @click="step = 2">
            Seterusnya <UIcon name="i-lucide-arrow-right" class="ml-1" />
          </UButton>
        </div>
      </template>

      <!-- Step 2: Maklumat Permohonan -->
      <template v-else-if="step === 2">
        <h3 class="font-semibold mb-4">Langkah 2: Maklumat Permohonan</h3>
        <div class="space-y-4">
          <UFormField label="Jenis Permohonan" required>
            <div class="space-y-2">
              <label
                v-for="opt in jenisOptions"
                :key="opt.value"
                class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                :class="form.jenisPermohonan === opt.value
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'"
              >
                <input
                  v-model="form.jenisPermohonan"
                  type="radio"
                  :value="opt.value"
                  class="accent-gray-900"
                >
                <span class="text-sm font-medium">{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <UFormField v-if="isPindaOrPerbaharui" label="No. Lesen Sedia Ada" required>
            <UInput v-model="form.noLesenSediaAda" placeholder="Masukkan no. lesen sedia ada" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Kategori Lesen">
              <USelect
                v-model="form.kategoriLesen"
                :items="kategoriOptions"
                placeholder="Pilih kategori"
                class="w-full"
              />
            </UFormField>
            <UFormField v-if="subKategoriOptions.length" label="Sub-Kategori">
              <USelect
                v-model="form.subKategori"
                :items="subKategoriOptions"
                placeholder="Pilih sub-kategori"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Lokasi Premis (jika berbeza daripada alamat syarikat)">
            <UTextarea v-model="form.lokasi" placeholder="Alamat premis yang akan menggunakan bahan/peralatan sinaran..." :rows="2" class="w-full" />
          </UFormField>

          <UFormField label="Aktiviti Sinaran">
            <UTextarea v-model="form.aktiviti" placeholder="Huraikan aktiviti sinaran yang akan dijalankan..." :rows="3" class="w-full" />
          </UFormField>

          <UFormField label="Bilangan Peralatan / Sumber Sinaran">
            <UInput v-model.number="form.bilPeralatan" type="number" :min="0" placeholder="0" class="w-full" />
          </UFormField>

          <UFormField label="Keterangan / Tujuan Permohonan">
            <UTextarea
              v-model="form.keterangan"
              placeholder="Huraikan tujuan permohonan lesen ini..."
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>
        <div class="flex justify-between mt-6">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="step = 1">Kembali</UButton>
          <UButton color="neutral" @click="step = 3">Seterusnya <UIcon name="i-lucide-arrow-right" class="ml-1" /></UButton>
        </div>
      </template>

      <!-- Step 3: Semak & Hantar -->
      <template v-else>
        <h3 class="font-semibold mb-4">Langkah 3: Semak & Hantar</h3>

        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Maklumat Syarikat</h4>
        <dl class="space-y-2 text-sm mb-5">
          <div class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Nama Syarikat</dt>
            <dd class="font-medium">{{ form.namaSyarikat }}</dd>
          </div>
          <div class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">No. Daftar</dt>
            <dd class="font-medium">{{ form.noDaftar }}</dd>
          </div>
          <div class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Alamat</dt>
            <dd class="font-medium">{{ form.alamat }}, {{ form.poskod }} {{ form.negeri }}</dd>
          </div>
          <div v-if="form.tel" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Telefon</dt>
            <dd class="font-medium">{{ form.tel }}</dd>
          </div>
          <div v-if="form.email" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">E-mel</dt>
            <dd class="font-medium">{{ form.email }}</dd>
          </div>
        </dl>

        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Maklumat Permohonan</h4>
        <dl class="space-y-2 text-sm mb-5">
          <div class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Jenis Permohonan</dt>
            <dd class="font-medium">{{ jenisOptions.find(j => j.value === form.jenisPermohonan)?.label }}</dd>
          </div>
          <div v-if="form.noLesenSediaAda" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">No. Lesen Sedia Ada</dt>
            <dd class="font-medium">{{ form.noLesenSediaAda }}</dd>
          </div>
          <div v-if="form.kategoriLesen" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Kategori Lesen</dt>
            <dd class="font-medium">{{ kategoriLabel }}</dd>
          </div>
          <div v-if="form.subKategori" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Sub-Kategori</dt>
            <dd class="font-medium">{{ subKategoriLabel }}</dd>
          </div>
          <div v-if="form.lokasi" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Lokasi Premis</dt>
            <dd class="font-medium">{{ form.lokasi }}</dd>
          </div>
          <div v-if="form.aktiviti" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Aktiviti Sinaran</dt>
            <dd class="font-medium">{{ form.aktiviti }}</dd>
          </div>
          <div v-if="form.bilPeralatan" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Bil. Peralatan</dt>
            <dd class="font-medium">{{ form.bilPeralatan }}</dd>
          </div>
          <div v-if="form.keterangan" class="flex gap-4">
            <dt class="w-44 text-gray-500 shrink-0">Keterangan</dt>
            <dd class="font-medium">{{ form.keterangan }}</dd>
          </div>
        </dl>

        <UAlert class="mt-4" color="info" variant="subtle" icon="i-lucide-info" description="Dengan mengklik 'Kemukakan', permohonan ini akan dihantar kepada Pegawai Semakan untuk semakan." />
        <div class="flex justify-between mt-6">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="step = 2">Kembali</UButton>
          <div class="flex gap-2">
            <UButton color="neutral" variant="subtle" :loading="loading" @click="submitForm(true)">
              Simpan Draf
            </UButton>
            <UButton color="neutral" :loading="loading" @click="submitForm(false)">
              <UIcon name="i-lucide-send" class="mr-1" /> Kemukakan
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
