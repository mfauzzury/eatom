// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  ui: {
    colors: {
      primary: 'neutral'
    }
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  devtools: {
    enabled: true
  },

  devServer: {
    port: 3001
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': { cors: true }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    experimental: {
      database: false
    }
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? './db/eatom.db',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
      gatePin: process.env.NUXT_PUBLIC_GATE_PIN ?? ''
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
