import { createApp, h } from "vue";
import MDZDialogNewDocument from "~/components/MDZDialogNewDocument.vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  components,
  directives,
});

export function useFileUploadDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };

        return () =>
          h(MDZDialogNewDocument, {
            "onUpload:finished": async () => {
              console.info("Upload finished.");
              closeDialog();
              resolve(true);
            },
            "onDialog:cancel": () => {
              closeDialog();
              resolve(false);
            },
          });
      },
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    dialogApp.use(vuetify);
    dialogApp.mount(container);
  });
}
