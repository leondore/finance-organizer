// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: '',
    env: 'development',
    baseUrl: 'http://localhost:3000',
    appName: 'Finance Organizer',
    attachmentsBucket: '',
    awsRegion: 'us-east-1',
    awsAccessKey: '',
    awsSecretAccessKey: '',
    public: {
      fromAddress: 'hello@leon.ninja',
      replyToAddress: 'no-reply@leon.ninja',
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
});
