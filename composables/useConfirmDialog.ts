// composables/useDialog.ts
import { createApp, h } from "vue";
import MDZNewDialog, { DialogOptions } from "~/components/MDZNewDialog.vue";

export function useConfirmDialog(content: DialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };

        return () =>
          h(MDZNewDialog, {
            ...content,
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
    dialogApp.mount(container);
  });
}
