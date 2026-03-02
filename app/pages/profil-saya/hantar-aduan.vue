<script setup lang="ts">
definePageMeta({ title: 'Hantar Aduan' })

const toast = useToast()
const { user } = useAuthUser()

interface Aduan {
  id: number
  tajuk: string
  pengadu: string
  keutamaan: 'tinggi' | 'sederhana' | 'rendah'
  status: 'menunggu' | 'dalam_proses' | 'selesai'
  tarikh: string
  penerangan: string
  lokasi: string
  tindakan: string
}

// Shared state with terima-aduan page
const aduanList = useState<Aduan[]>('aduan_list', () => [
  { id: 1, tajuk: 'Kerosakan Alat Pengukur Radiasi', pengadu: 'Ahmad Teknisi', keutamaan: 'tinggi', status: 'dalam_proses', tarikh: '2026-02-20', penerangan: 'Alat pengukur radiasi di makmal B3 tidak berfungsi sejak minggu lepas. Bacaan tidak konsisten dan perlu penggantian segera.', lokasi: 'Makmal B3, Aras 2', tindakan: 'Telah hubungi vendor untuk pembaikan.' },
  { id: 2, tajuk: 'Kebocoran Paip di Stor Bahan', pengadu: 'Siti Penyelenggara', keutamaan: 'tinggi', status: 'menunggu', tarikh: '2026-02-22', penerangan: 'Terdapat kebocoran paip di stor bahan kimia yang boleh menjejaskan keselamatan bahan. Memerlukan tindakan segera.', lokasi: 'Stor Bahan, Aras 1', tindakan: '' },
  { id: 3, tajuk: 'Sistem Pendingin Hawa Tidak Berfungsi', pengadu: 'Kamal Operator', keutamaan: 'sederhana', status: 'dalam_proses', tarikh: '2026-02-18', penerangan: 'Pendingin hawa di bilik kawalan tidak berfungsi menyebabkan suhu melebihi had yang ditetapkan untuk peralatan sensitif.', lokasi: 'Bilik Kawalan, Aras 3', tindakan: 'Unit penyelenggaraan sedang menjalankan pembaikan.' },
  { id: 4, tajuk: 'Lampu Kecemasan Tidak Menyala', pengadu: 'Nora Keselamatan', keutamaan: 'sederhana', status: 'selesai', tarikh: '2026-02-15', penerangan: 'Beberapa lampu kecemasan di koridor utama tidak menyala semasa ujian keselamatan bulanan.', lokasi: 'Koridor Utama, Aras 1-3', tindakan: 'Semua lampu kecemasan telah diganti dan diuji semula. Berfungsi dengan baik.' },
  { id: 5, tajuk: 'Akses Kad Pintu Rosak', pengadu: 'Ali Keselamatan', keutamaan: 'rendah', status: 'menunggu', tarikh: '2026-02-23', penerangan: 'Kad akses pintu belakang bangunan tidak berfungsi. Kakitangan perlu menggunakan pintu utama sahaja.', lokasi: 'Pintu Belakang, Aras G', tindakan: '' },
  { id: 6, tajuk: 'Komputer Server Perlahan', pengadu: 'Rizal IT', keutamaan: 'rendah', status: 'selesai', tarikh: '2026-02-10', penerangan: 'Prestasi server utama semakin perlahan menyebabkan kelewatan dalam pemprosesan data.', lokasi: 'Bilik Server, Aras 1', tindakan: 'Penambahan RAM dan pembersihan cache telah dilakukan. Prestasi kembali normal.' },
  { id: 7, tajuk: 'Kerosakan Lif Bangunan', pengadu: 'Haslinda Pentadbiran', keutamaan: 'tinggi', status: 'dalam_proses', tarikh: '2026-02-21', penerangan: 'Lif utama bangunan tersekat di aras 2 dan tidak boleh digunakan. Vendor telah dihubungi.', lokasi: 'Lif Utama', tindakan: 'Vendor dijangka tiba esok untuk pembaikan.' },
  { id: 8, tajuk: 'Kebersihan Tandas Kurang Memuaskan', pengadu: 'Farah Staf', keutamaan: 'rendah', status: 'selesai', tarikh: '2026-02-12', penerangan: 'Tandas di aras 2 kurang bersih dan perlu perhatian dari pihak pembersihan.', lokasi: 'Tandas, Aras 2', tindakan: 'Jadual pembersihan telah dikemaskini. Pemantauan berkala ditetapkan.' },
])

// Only show aduan submitted by this user
const myAduan = computed(() =>
  aduanList.value.filter(a => a.pengadu === user.value?.name)
)

const showModal = ref(false)
const submitting = ref(false)

const form = reactive({
  tajuk: '',
  keutamaan: '' as string,
  penerangan: '',
  lokasi: '',
})

const priorityColour: Record<string, string> = {
  tinggi: 'error',
  sederhana: 'warning',
  rendah: 'neutral',
}
const priorityLabel: Record<string, string> = {
  tinggi: 'Tinggi',
  sederhana: 'Sederhana',
  rendah: 'Rendah',
}
const statusColour: Record<string, string> = {
  menunggu: 'warning',
  dalam_proses: 'info',
  selesai: 'success',
}
const statusLabel: Record<string, string> = {
  menunggu: 'Menunggu',
  dalam_proses: 'Dalam Proses',
  selesai: 'Selesai',
}

const columns = [
  { accessorKey: 'tajuk', header: 'Aduan' },
  { accessorKey: 'keutamaan', header: 'Keutamaan' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'tarikh', header: 'Tarikh Hantar' },
]

function openModal() {
  form.tajuk = ''
  form.keutamaan = ''
  form.penerangan = ''
  form.lokasi = ''
  showModal.value = true
}

async function handleSubmit() {
  if (!form.tajuk || !form.keutamaan || !form.penerangan) {
    toast.add({ title: 'Ralat', description: 'Sila lengkapkan semua medan wajib.', color: 'error' })
    return
  }
  submitting.value = true
  await new Promise(r => setTimeout(r, 600))

  const maxId = Math.max(...aduanList.value.map(a => a.id), 0)
  aduanList.value.unshift({
    id: maxId + 1,
    tajuk: form.tajuk,
    pengadu: user.value?.name ?? 'Pengguna',
    keutamaan: form.keutamaan as Aduan['keutamaan'],
    status: 'menunggu',
    tarikh: new Date().toISOString().slice(0, 10),
    penerangan: form.penerangan,
    lokasi: form.lokasi || '-',
    tindakan: '',
  })

  submitting.value = false
  showModal.value = false
  toast.add({ title: 'Berjaya', description: 'Aduan anda telah dihantar dan sedang diproses.', color: 'success' })
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Hantar Aduan</h2>
        <p class="text-sm text-gray-500">Kemukakan aduan atau maklum balas berkaitan kemudahan dan perkhidmatan.</p>
      </div>
      <UButton icon="i-lucide-plus" color="neutral" @click="openModal">
        Aduan Baru
      </UButton>
    </div>

    <!-- My aduan list -->
    <UCard :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-sm">Aduan Saya</h3>
            <p class="text-xs text-gray-400 mt-0.5">Senarai aduan yang telah anda kemukakan.</p>
          </div>
          <UBadge color="neutral" variant="soft">{{ myAduan.length }} aduan</UBadge>
        </div>
      </template>

      <UTable :data="myAduan" :columns="columns" hover>
        <template #tajuk-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 text-sm">{{ row.original.tajuk }}</p>
            <p class="text-xs text-gray-400">{{ row.original.lokasi }}</p>
          </div>
        </template>
        <template #keutamaan-cell="{ row }">
          <UBadge :color="(priorityColour[row.original.keutamaan] ?? 'neutral') as any" variant="soft" size="sm">
            {{ priorityLabel[row.original.keutamaan] ?? row.original.keutamaan }}
          </UBadge>
        </template>
        <template #status-cell="{ row }">
          <div class="flex items-center gap-2">
            <UBadge :color="(statusColour[row.original.status] ?? 'neutral') as any" variant="soft" size="sm">
              {{ statusLabel[row.original.status] ?? row.original.status }}
            </UBadge>
            <span v-if="row.original.tindakan" class="text-xs text-gray-400 truncate max-w-40">
              — {{ row.original.tindakan }}
            </span>
          </div>
        </template>
        <template #tarikh-cell="{ row }">
          <span class="text-xs text-gray-500">{{ row.original.tarikh }}</span>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-400">
            <UIcon name="i-lucide-message-square-dashed" class="w-10 h-10 mx-auto mb-2" />
            <p class="text-sm">Anda belum menghantar sebarang aduan.</p>
            <UButton size="xs" variant="ghost" color="neutral" class="mt-2" @click="openModal">
              Hantar aduan pertama anda
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>

    <ClientOnly>
      <UModal v-model:open="showModal">
        <template #content>
          <UCard>
            <template #header>
              <div>
                <h3 class="font-semibold">Hantar Aduan Baru</h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  Dihantar oleh: <span class="font-medium text-gray-700">{{ user?.name }}</span>
                </p>
              </div>
            </template>

            <div class="space-y-4">
              <UFormField label="Tajuk Aduan" required>
                <UInput v-model="form.tajuk" placeholder="Nyatakan tajuk aduan anda" class="w-full" />
              </UFormField>

              <UFormField label="Keutamaan" required>
                <USelect
                  v-model="form.keutamaan"
                  :items="[
                    { label: '-- Pilih Keutamaan --', value: '' },
                    { label: 'Tinggi — Memerlukan tindakan segera', value: 'tinggi' },
                    { label: 'Sederhana — Perlu diurus dalam masa terdekat', value: 'sederhana' },
                    { label: 'Rendah — Boleh ditangguhkan', value: 'rendah' },
                  ]"
                  value-key="value"
                  label-key="label"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Penerangan" required>
                <UTextarea
                  v-model="form.penerangan"
                  placeholder="Huraikan aduan anda dengan terperinci..."
                  :rows="4"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Lokasi">
                <UInput v-model="form.lokasi" placeholder="Lokasi berkaitan (cth: Makmal B3, Aras 2)" class="w-full" />
              </UFormField>
            </div>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showModal = false">Batal</UButton>
                <UButton color="neutral" icon="i-lucide-send" :loading="submitting" @click="handleSubmit">
                  Hantar Aduan
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
