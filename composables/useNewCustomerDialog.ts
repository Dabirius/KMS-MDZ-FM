// composables/useDialog.ts
import { createApp, h } from 'vue';
import MDZDialogNewCustomer from '~/components/MDZDialogNewCustomer.vue';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { useEntities } from '~/stores/api/entities';


const vuetify = createVuetify({
  components,
  directives,
});

export function useNewCustomerDialog(): Promise<boolean> {
  const instance = getCurrentInstance();
  return new Promise((resolve) => {
    const dialogApp = createApp({
      setup() {
        const closeDialog = () => {
          dialogApp.unmount();
          document.body.removeChild(container);
        };
        //component, props, events
        return () => h(MDZDialogNewCustomer, {
          'onDialog:confirm': async (name: string, id: number) => {
            const store = useEntities();
            await store.createEntity({
              name: name,
              advisorId: id ?? null,
            });
            closeDialog();
            resolve(true);
          },
          'onDialog:cancel': () => {
            closeDialog();
            resolve(false);
          },
          instance
        });
      }
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    dialogApp.use(vuetify);
    dialogApp.mount(container);
  });
}
