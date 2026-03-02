<script setup lang="ts">
definePageMeta({ title: 'Pengurusan Pengguna & Peranan' })

const { hasRole } = useAuthUser()
if (import.meta.client && !hasRole('ADMIN')) {
  await navigateTo('/dashboard')
}

const toast = useToast()

interface User {
  id: number
  name: string
  email: string
  unit: string
  role: string
  status: 'aktif' | 'tidak_aktif'
  lastLogin: string
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Pentadbir Sistem',
  PS: 'Pegawai Semakan',
  KU: 'Ketua Unit',
  P: 'Pengarah',
  KP: 'Ketua Pengarah',
  PL: 'Pemegang Lesen',
  AWAM: 'Orang Awam',
}

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({ label, value }))

const statusColour: Record<string, string> = {
  aktif: 'success', tidak_aktif: 'neutral'
}

const users = useState<User[]>('admin_users', () => [
  { id: 1,  name: 'Ahmad Admin',      email: 'admin@eatom.gov.my',  unit: 'Pentadbiran',   role: 'ADMIN', status: 'aktif',       lastLogin: '2026-02-24 08:02' },
  { id: 2,  name: 'Siti Semakan',     email: 'ps@eatom.gov.my',     unit: 'BPP',            role: 'PS',    status: 'aktif',       lastLogin: '2026-02-24 08:05' },
  { id: 3,  name: 'Kamal Ketua',      email: 'ku@eatom.gov.my',     unit: 'BPP',            role: 'KU',    status: 'aktif',       lastLogin: '2026-02-24 08:30' },
  { id: 4,  name: 'Dato Pengarah',    email: 'p@eatom.gov.my',      unit: 'Pengurusan',     role: 'P',     status: 'aktif',       lastLogin: '2026-02-20 10:15' },
  { id: 5,  name: 'Syarikat Atom PL', email: 'pl@syarikat.com',     unit: 'Luar',           role: 'PL',    status: 'aktif',       lastLogin: '2026-02-24 09:00' },
  { id: 6,  name: 'Ali Awam',         email: 'awam@email.com',      unit: 'Luar',           role: 'AWAM',  status: 'aktif',       lastLogin: '2026-02-18 14:22' },
  { id: 7,  name: 'Nora Pegawai',     email: 'nora@eatom.gov.my',   unit: 'BPP',            role: 'PS',    status: 'aktif',       lastLogin: '2026-02-22 09:45' },
  { id: 8,  name: 'Rizal Inspektor',  email: 'rizal@eatom.gov.my',  unit: 'BPP',            role: 'PS',    status: 'tidak_aktif', lastLogin: '2025-12-01 11:30' },
  { id: 9,  name: 'Haslinda KP',      email: 'kp@eatom.gov.my',     unit: 'Pengurusan',     role: 'KP',    status: 'aktif',       lastLogin: '2026-02-19 16:00' },
  { id: 10, name: 'MediRad PL',       email: 'medrad@klinik.my',    unit: 'Luar',           role: 'PL',    status: 'aktif',       lastLogin: '2026-02-23 11:10' },
])

const search = ref('')
const editUser = ref<User | null>(null)
const showEditModal = ref(false)
const showAddModal = ref(false)
const deactivateTarget = ref<User | null>(null)
const showDeactivateModal = ref(false)
const saving = ref(false)

// Add form
const addForm = reactive({
  name: '',
  ic: '',
  email: '',
  phone: '',
  unit: '',
  role: '',
})

const filtered = computed(() => users.value.filter(u =>
  !search.value ||
  u.name.toLowerCase().includes(search.value.toLowerCase()) ||
  u.email.toLowerCase().includes(search.value.toLowerCase())
))

// Role summary cards
const roleCounts = computed(() =>
  Object.entries(roleLabels).map(([role, label]) => ({
    role,
    label,
    count: users.value.filter(u => u.role === role).length,
  })).filter(r => r.count > 0)
)

const columns = [
  { accessorKey: 'name', header: 'Pengguna' },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'role', header: 'Peranan' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'lastLogin', header: 'Log Masuk Terakhir' },
  { id: 'actions', header: '' },
]

function openEdit(u: User) {
  editUser.value = { ...u }
  showEditModal.value = true
}

function saveEditUser() {
  if (!editUser.value) return
  saving.value = true
  const idx = users.value.findIndex(u => u.id === editUser.value!.id)
  if (idx >= 0) {
    users.value[idx] = { ...editUser.value }
  }
  toast.add({ title: 'Berjaya', description: `Pengguna ${editUser.value.name} berjaya dikemaskini.`, color: 'success' })
  saving.value = false
  showEditModal.value = false
  editUser.value = null
}

function openDeactivate(u: User) {
  deactivateTarget.value = u
  showDeactivateModal.value = true
}

function confirmDeactivate() {
  if (!deactivateTarget.value) return
  const idx = users.value.findIndex(u => u.id === deactivateTarget.value!.id)
  if (idx >= 0) {
    users.value[idx] = { ...users.value[idx], status: 'tidak_aktif' }
  }
  toast.add({ title: 'Nyahaktif', description: `Akaun ${deactivateTarget.value.name} telah dinyahaktifkan.`, color: 'warning' })
  showDeactivateModal.value = false
  deactivateTarget.value = null
}

function saveAddUser() {
  if (!addForm.name || !addForm.email || !addForm.role) {
    toast.add({ title: 'Ralat', description: 'Sila lengkapkan semua medan wajib.', color: 'error' })
    return
  }
  const maxId = Math.max(...users.value.map(u => u.id), 0)
  users.value.push({
    id: maxId + 1,
    name: addForm.name,
    email: addForm.email,
    unit: addForm.unit || 'Belum ditetapkan',
    role: addForm.role,
    status: 'aktif',
    lastLogin: '-',
  })
  toast.add({ title: 'Berjaya', description: `Pengguna ${addForm.name} berjaya ditambah. Kata laluan sementara dihantar ke e-mel.`, color: 'success' })
  showAddModal.value = false
  addForm.name = ''
  addForm.ic = ''
  addForm.email = ''
  addForm.phone = ''
  addForm.unit = ''
  addForm.role = ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Pengurusan Pengguna &amp; Peranan</h2>
        <p class="text-sm text-gray-500">Urus akaun pengguna dan penugasan peranan akses sistem.</p>
      </div>
      <UButton icon="i-lucide-plus" color="neutral" @click="showAddModal = true">
        Tambah Pengguna
      </UButton>
    </div>

    <!-- Role summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div
        v-for="rc in roleCounts"
        :key="rc.role"
        class="rounded-xl border border-gray-100 bg-white p-4"
      >
        <p class="text-xs text-gray-500">{{ rc.label }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ rc.count }}</p>
      </div>
    </div>

    <!-- Table -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="p-4 border-b border-gray-100 flex items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari nama atau e-mel..."
          class="w-64"
        />
        <span class="ml-auto text-xs text-gray-400">{{ filtered.length }} pengguna</span>
      </div>

      <UTable :data="filtered" :columns="columns" hover>
        <template #name-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 text-sm">{{ row.original.name }}</p>
            <p class="text-xs text-gray-400">{{ row.original.email }}</p>
          </div>
        </template>
        <template #role-cell="{ row }">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            <UIcon name="i-lucide-shield" class="w-3 h-3" />
            {{ roleLabels[row.original.role] ?? row.original.role }}
          </span>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="(statusColour[row.original.status] ?? 'neutral') as any" variant="soft" size="sm">
            {{ row.original.status === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}
          </UBadge>
        </template>
        <template #lastLogin-cell="{ row }">
          <span class="text-xs text-gray-500">{{ row.original.lastLogin }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-pencil" @click="openEdit(row.original)">
              Edit
            </UButton>
            <UButton
              v-if="row.original.status === 'aktif'"
              size="xs"
              variant="ghost"
              color="error"
              icon="i-lucide-user-x"
              @click="openDeactivate(row.original)"
            >
              Nyahaktif
            </UButton>
          </div>
        </template>
        <template #empty>
          <div class="text-center py-10 text-gray-500">
            <UIcon name="i-lucide-users" class="w-10 h-10 mx-auto mb-2" />
            <p>Tiada pengguna dijumpai.</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <ClientOnly>
      <!-- Edit User Modal -->
      <UModal v-model:open="showEditModal">
        <template #content>
          <UCard v-if="editUser">
            <template #header>
              <h3 class="font-semibold">Edit Pengguna</h3>
            </template>
            <div class="space-y-4">
              <!-- User banner -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-12 h-12 rounded-xl bg-indigo-700 flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {{ editUser.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ editUser.name }}</p>
                  <p class="text-sm text-gray-500">{{ editUser.email }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Nama Penuh">
                  <UInput v-model="editUser.name" class="w-full" />
                </UFormField>
                <UFormField label="E-mel">
                  <UInput v-model="editUser.email" type="email" class="w-full" />
                </UFormField>
                <UFormField label="Unit">
                  <UInput v-model="editUser.unit" class="w-full" />
                </UFormField>
                <UFormField label="Peranan">
                  <USelect
                    v-model="editUser.role"
                    :items="roleOptions"
                    value-key="value"
                    label-key="label"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Status">
                  <USelect
                    v-model="editUser.status"
                    :items="[
                      { label: 'Aktif', value: 'aktif' },
                      { label: 'Tidak Aktif', value: 'tidak_aktif' },
                    ]"
                    value-key="value"
                    label-key="label"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showEditModal = false">Batal</UButton>
                <UButton color="neutral" :loading="saving" @click="saveEditUser">Simpan</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

      <!-- Add User Modal -->
      <UModal v-model:open="showAddModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Tambah Pengguna Baru</h3>
            </template>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Nama Penuh" required>
                  <UInput v-model="addForm.name" placeholder="Nama penuh" class="w-full" />
                </UFormField>
                <UFormField label="No. Kad Pengenalan" required>
                  <UInput v-model="addForm.ic" placeholder="XXXXXX-XX-XXXX" class="w-full" />
                </UFormField>
                <UFormField label="E-mel" required>
                  <UInput v-model="addForm.email" type="email" placeholder="e-mel@domain.my" class="w-full" />
                </UFormField>
                <UFormField label="No. Telefon">
                  <UInput v-model="addForm.phone" placeholder="01X-XXXXXXX" class="w-full" />
                </UFormField>
                <UFormField label="Unit / Jabatan">
                  <UInput v-model="addForm.unit" placeholder="Unit" class="w-full" />
                </UFormField>
                <UFormField label="Peranan" required>
                  <USelect
                    v-model="addForm.role"
                    :items="[{ label: '-- Pilih Peranan --', value: '' }, ...roleOptions]"
                    value-key="value"
                    label-key="label"
                    class="w-full"
                  />
                </UFormField>
              </div>
              <p class="text-xs text-gray-400">Kata laluan sementara akan dihantar ke e-mel pengguna.</p>
            </div>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showAddModal = false">Batal</UButton>
                <UButton color="neutral" @click="saveAddUser">Simpan</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

      <!-- Deactivate Confirm Modal -->
      <UModal v-model:open="showDeactivateModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Nyahaktifkan Pengguna</h3>
            </template>
            <UAlert
              color="warning"
              variant="subtle"
              icon="i-lucide-alert-triangle"
              :description="`Adakah anda pasti mahu nyahaktifkan akaun ${deactivateTarget?.name}? Pengguna tidak akan dapat log masuk selepas ini.`"
            />
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="ghost" @click="showDeactivateModal = false">Batal</UButton>
                <UButton color="error" @click="confirmDeactivate">Nyahaktifkan</UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
