// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: '',
    env: 'development',
    attachmentsBucket: '',
    awsAccessKey: '',
    awsSecretAccessKey: '',
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
});
