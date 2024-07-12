// composables/useDialog.ts
import { createApp, h } from "vue";
import MDZDialogRenameDocument from "~/components/MDZDialogRenameDocument.vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";
import { useEntities } from "~/stores/api/entities";

const vuetify = createVuetify({
  components,
  directives,
});

export function useRenameDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };

        return () =>
          h(MDZDialogRenameDocument, {
            "onDialog:confirm": () => {
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

export function useRenameEntityDialog(id?: number): Promise<boolean> {
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };

        return () =>
          h(MDZDialogRenameDocument, {
            title: "Objekt umbenennen?",
            description: "Bitte geben Sie eine neue Bezeichnung ein.",
            type: "Entity",
            "onDialog:confirm": async (newName: string | undefined) => {
              const store = useEntities();
              await store.renameEntity(newName, id);
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
