// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: '',
    env: 'development',
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
