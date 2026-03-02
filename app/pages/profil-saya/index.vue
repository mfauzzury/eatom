<script setup lang="ts">
definePageMeta({ title: 'Profil Saya' })

const toast = useToast()
const { user, role, setUser } = useAuthUser()

const roleLabels: Record<string, string> = {
  ADMIN: 'Pentadbir Sistem',
  PS: 'Pegawai Semakan',
  KU: 'Ketua Unit',
  P: 'Pengarah',
  KP: 'Ketua Pengarah',
  PL: 'Pemegang Lesen',
  AWAM: 'Orang Awam',
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  PS: 'bg-blue-100 text-blue-700',
  KU: 'bg-cyan-100 text-cyan-700',
  P: 'bg-amber-100 text-amber-700',
  KP: 'bg-orange-100 text-orange-700',
  PL: 'bg-green-100 text-green-700',
  AWAM: 'bg-gray-100 text-gray-600',
}

const editing = ref(false)
const saving = ref(false)
const editForm = reactive({ name: '', bahagian: '' })

const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
})

function startEdit() {
  editForm.name = user.value?.name ?? ''
  editForm.bahagian = user.value?.bahagian ?? ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function saveEdit() {
  if (!editForm.name.trim()) {
    toast.add({ title: 'Ralat', description: 'Nama tidak boleh kosong.', color: 'error' })
    return
  }
  saving.value = true
  await new Promise(r => setTimeout(r, 500))

  const updated = {
    ...user.value!,
    name: editForm.name.trim(),
    bahagian: editForm.bahagian.trim(),
  }
  setUser(updated)
  if (import.meta.client) {
    localStorage.setItem('eatom_user', JSON.stringify(updated))
  }

  saving.value = false
  editing.value = false
  toast.add({ title: 'Berjaya', description: 'Profil berjaya dikemaskini.', color: 'success' })
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Profil Saya</h2>
      <p class="text-sm text-gray-500">Maklumat akaun dan profil peribadi anda.</p>
    </div>

    <!-- Avatar + name card -->
    <UCard>
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
          <span class="text-xl font-bold text-white">{{ initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ user?.name ?? '-' }}</h3>
          <p class="text-sm text-gray-500 truncate">{{ user?.email ?? '-' }}</p>
          <span
            class="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="roleColors[role ?? ''] ?? 'bg-gray-100 text-gray-600'"
          >
            {{ roleLabels[role ?? ''] ?? role }}
          </span>
        </div>
      </div>
    </UCard>

    <!-- Detail fields -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-sm">Maklumat Akaun</h3>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ editing ? 'Kemaskini maklumat anda di bawah.' : 'Butiran peribadi berkaitan akaun anda.' }}
            </p>
          </div>
          <UButton
            v-if="!editing"
            icon="i-lucide-pencil"
            color="neutral"
            variant="outline"
            size="xs"
            @click="startEdit"
          >
            Edit Profil
          </UButton>
        </div>
      </template>

      <!-- View mode -->
      <dl v-if="!editing" class="divide-y divide-gray-100">
        <div class="flex items-center gap-4 py-3.5">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <dt class="text-xs text-gray-400 font-medium">Nama Penuh</dt>
            <dd class="text-sm text-gray-900 font-medium mt-0.5">{{ user?.name ?? '-' }}</dd>
          </div>
        </div>

        <div class="flex items-center gap-4 py-3.5">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-mail" class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <dt class="text-xs text-gray-400 font-medium">Alamat E-mel</dt>
            <dd class="text-sm text-gray-900 font-medium mt-0.5">{{ user?.email ?? '-' }}</dd>
          </div>
          <span class="text-xs text-gray-400 shrink-0">Tidak boleh ditukar</span>
        </div>

        <div class="flex items-center gap-4 py-3.5">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <dt class="text-xs text-gray-400 font-medium">Bahagian / Syarikat</dt>
            <dd class="text-sm text-gray-900 font-medium mt-0.5">{{ user?.bahagian || '-' }}</dd>
          </div>
        </div>

        <div class="flex items-center gap-4 py-3.5">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-fingerprint" class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <dt class="text-xs text-gray-400 font-medium">ID Pengguna</dt>
            <dd class="text-sm text-gray-900 font-medium mt-0.5 font-mono">{{ user?.id ?? '-' }}</dd>
          </div>
          <span class="text-xs text-gray-400 shrink-0">Tidak boleh ditukar</span>
        </div>

        <div class="flex items-center gap-4 py-3.5">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-shield" class="w-4 h-4 text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <dt class="text-xs text-gray-400 font-medium">Peranan</dt>
            <dd class="mt-0.5">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="roleColors[role ?? ''] ?? 'bg-gray-100 text-gray-600'"
              >
                {{ roleLabels[role ?? ''] ?? role }}
              </span>
            </dd>
          </div>
          <span class="text-xs text-gray-400 shrink-0">Tidak boleh ditukar</span>
        </div>
      </dl>

      <!-- Edit mode -->
      <form v-else class="space-y-4 pt-1" @submit.prevent="saveEdit">
        <UFormField label="Nama Penuh" required>
          <UInput
            v-model="editForm.name"
            placeholder="Masukkan nama penuh"
            class="w-full"
            autofocus
          />
        </UFormField>

        <UFormField label="Bahagian / Syarikat">
          <UInput
            v-model="editForm.bahagian"
            placeholder="Nama bahagian atau syarikat"
            class="w-full"
          />
        </UFormField>

        <!-- Read-only fields shown as disabled -->
        <div class="p-3 bg-gray-50 rounded-lg space-y-2">
          <p class="text-xs font-medium text-gray-500">Maklumat berikut tidak boleh ditukar:</p>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-gray-400">E-mel</span>
              <p class="text-gray-700 font-medium">{{ user?.email }}</p>
            </div>
            <div>
              <span class="text-gray-400">Peranan</span>
              <p class="text-gray-700 font-medium">{{ roleLabels[role ?? ''] ?? role }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <UButton type="button" color="neutral" variant="ghost" @click="cancelEdit">Batal</UButton>
          <UButton type="submit" color="neutral" icon="i-lucide-check" :loading="saving">
            Simpan Perubahan
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Quick actions (view mode only) -->
    <div v-if="!editing" class="flex gap-3">
      <UButton
        to="/profil-saya/tukar-kata-laluan"
        icon="i-lucide-lock"
        color="neutral"
        variant="outline"
        size="sm"
      >
        Tukar Kata Laluan
      </UButton>
    </div>
  </div>
</template>
