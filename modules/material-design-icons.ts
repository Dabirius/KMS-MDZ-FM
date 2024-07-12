// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { resolve } from "path";
import { addComponentsDir, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "material-design-icons",
  },
  setup() {
    addComponentsDir({
      path: resolve("node_modules/vue-material-design-icons/"),
      prefix: "MatIcons",
      global: false,
    });
  },
});
