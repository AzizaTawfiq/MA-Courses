import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-16',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@pinia/nuxt'],
  app: {
    head: {
      title: 'MA Training Platform',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ]
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'ar',
    locales: [
      { code: 'ar', iso: 'ar-SA', name: 'العربية', dir: 'rtl', file: 'ar.json' },
      { code: 'en', iso: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ma-training-locale',
      redirectOn: 'root'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  tailwindcss: {
    viewer: false
  }
})
