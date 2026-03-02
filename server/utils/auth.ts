// Mock auth for Vercel deployment — no database

const DEMO_USER = {
  id: 'user-2',
  name: 'Siti Semakan',
  email: 'ps@eatom.gov.my',
  emailVerified: true,
  image: null,
  role: 'PS',
  bahagian: 'BPP',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

export const auth = {
  api: {
    getSession: async (_opts: { headers: Headers }) => ({
      user: DEMO_USER,
      session: {
        id: 'demo-session',
        token: 'demo-token',
        userId: DEMO_USER.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  },
  handler: async (_req: Request) => {
    return new Response(JSON.stringify({ user: DEMO_USER }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>
export type User = typeof DEMO_USER
