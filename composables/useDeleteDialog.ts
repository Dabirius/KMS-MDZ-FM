import { createApp, h } from "vue";
import MDZDialogDeleteDocument from "~/components/MDZDialogDeleteDocument.vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  components,
  directives,
});

export function useDeleteCustomerDialog(): Promise<boolean> {
  const instance = getCurrentInstance();
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };
        //component, props, events
        return () =>
          h(MDZDialogDeleteDocument, {
            "onDialog:confirm": () => {
              closeDialog();
              resolve(true);
            },
            "onDialog:cancel": () => {
              closeDialog();
              resolve(false);
            },
            instance,
          });
      },
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    dialogApp.use(vuetify);
    dialogApp.mount(container);
  });
}
