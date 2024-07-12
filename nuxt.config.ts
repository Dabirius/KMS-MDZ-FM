// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [
    {
      path: "~/components",
      extensions: [".vue"],
    },
  ],
  css: ["@/assets/styles/global.scss"],
  modules: ["@invictus.codes/nuxt-vuetify", "@pinia/nuxt"],
  vuetify: {
    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: true,
      useIconCDN: true,

      /* vite-plugin-vuetify options */
      styles: "sass",
      autoImport: true,
      useVuetifyLabs: true,
    },
  },
  vite: {
    server: {
      cors: true, // Only for dev
    },
  },
});
