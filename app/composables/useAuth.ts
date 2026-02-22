// Mock auth — no backend required
// Uses useState for SSR-safe reactive state + localStorage for persistence

interface MockUser {
  id: string
  name: string
  email: string
  role: string
  bahagian: string
}

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Ahmad Admin', email: 'admin@eatom.gov.my', role: 'ADMIN', bahagian: 'Pentadbiran' },
  { id: '2', name: 'Siti Semakan', email: 'ps@eatom.gov.my', role: 'PS', bahagian: 'BPP' },
  { id: '3', name: 'Kamal Ketua', email: 'ku@eatom.gov.my', role: 'KU', bahagian: 'BPP' },
  { id: '4', name: 'Dato Pengarah', email: 'p@eatom.gov.my', role: 'P', bahagian: 'Pengurusan' },
  { id: '5', name: 'Syarikat Atom PL', email: 'pl@syarikat.com', role: 'PL', bahagian: '' },
  { id: '6', name: 'Ali Awam', email: 'awam@email.com', role: 'AWAM', bahagian: '' },
]

export function mockLogin(email: string, _password: string): MockUser | null {
  const user = MOCK_USERS.find(u => u.email === email)
  if (!user) return null
  if (import.meta.client) {
    localStorage.setItem('eatom_user', JSON.stringify(user))
  }
  return user
}

export function mockRegister(name: string, email: string, _password: string): MockUser | null {
  const existing = MOCK_USERS.find(u => u.email === email)
  if (existing) return null
  const newUser: MockUser = {
    id: String(MOCK_USERS.length + 1),
    name,
    email,
    role: 'AWAM',
    bahagian: ''
  }
  MOCK_USERS.push(newUser)
  if (import.meta.client) {
    localStorage.setItem('eatom_user', JSON.stringify(newUser))
  }
  return newUser
}

export function upgradeToLesen(userId: string, namaSyarikat: string): MockUser | null {
  const user = MOCK_USERS.find(u => u.id === userId)
  if (!user || user.role !== 'AWAM') return null
  user.role = 'PL'
  user.bahagian = namaSyarikat
  if (import.meta.client) {
    localStorage.setItem('eatom_user', JSON.stringify(user))
  }
  return user
}

export function mockLogout() {
  if (import.meta.client) {
    localStorage.removeItem('eatom_user')
  }
}

export function getMockUser(): MockUser | null {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('eatom_user')
      if (stored) return JSON.parse(stored)
    } catch {}
  }
  return null
}

export const useAuthUser = () => {
  const currentUser = useState<MockUser | null>('auth_user', () => null)

  // Hydrate from localStorage on client
  if (import.meta.client && !currentUser.value) {
    currentUser.value = getMockUser()
  }

  const user = computed(() => currentUser.value)
  const role = computed(() => currentUser.value?.role ?? null)
  const isLoggedIn = computed(() => !!currentUser.value)

  const hasRole = (...roles: string[]) => roles.includes(role.value ?? '')
  const isInternal = computed(() => hasRole('ADMIN', 'PS', 'KU', 'P', 'KP'))
  const isExternal = computed(() => hasRole('PL', 'AWAM'))
  const isPending = ref(false)

  function setUser(u: MockUser | null) {
    currentUser.value = u
  }

  return { user, role, isLoggedIn, isPending, hasRole, isInternal, isExternal, setUser }
}
