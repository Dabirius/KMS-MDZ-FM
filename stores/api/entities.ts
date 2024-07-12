import { defineStore } from "pinia";
import { ref } from "vue";
import { CEntity } from "~/types/db-types";

export type EntityNew = Omit<CEntity, "id">;

export const useEntities = defineStore("Entities", () => {
  const entities = ref<Array<CEntity>>([]);
  const loading = ref<boolean>(false);

  function $reset() {
    entities.value = [];
    loading.value = false;
  }

  async function fetchEntities(filterString?: string): Promise<void> {
    const fetchOptions = filterString
      ? { params: { search: filterString } }
      : {};
    loading.value = true;
    const { data } = await useFetch("/api/entities", fetchOptions);

    entities.value = data.value || [];

    loading.value = false;
  }

  async function fetchEntityById(value: number): Promise<CEntity | null> {
    loading.value = true;
    const { data } = await useFetch<CEntity>(`/api/entities/${value}`);
    loading.value = false;
    return data.value;
  }

  async function createEntity(entity: EntityNew) {
    loading.value = true;
    const { data } = await useFetch("/api/entities", {
      method: "POST",
      body: {
        name: entity.name?.toString(),
        advisor: entity.advisorId?.toString(),
      },
    });
    if (data && data.value) {
      entities.value.push(data.value);
      loading.value = false;
      return data.value;
    }
    loading.value = false;
    return null;
  }

  async function getEntityById(id: number): Promise<CEntity | undefined> {
    let entityMaybe: CEntity | undefined = entities.value.find(
      (c) => c.id === id,
    );
    if (!entityMaybe) {
      loading.value = true;
      await fetchEntities();
      entityMaybe = entities.value.find((c: CEntity) => c.id === id);
      loading.value = false;
    }
    return entityMaybe;
  }
  const removeEntity = async (id: number | undefined) => {
    if (!id) return;
    const { data } = await useFetch(`/api/entities/${id}`, {
      method: "DELETE",
    });
    if (data) {
      entities.value.splice(
        entities.value.findIndex((entity) => entity.id === id),
        1,
      );
    }
  };

  const renameEntity = async (newName: string | undefined, id?: number) => {
    if (!id || !newName) {
      return;
    }
    const entity = entities.value.filter((entity) => entity.id === id)[0];

    const { data } = await useFetch(`/api/entities/${entity.id}`, {
      method: "POST",
      body: {
        name: newName,
        advisor: entity.advisorId?.toString(),
      },
    });

    await fetchEntities();
  };

  return {
    // states
    entities,
    // getters
    loading: readonly(loading),
    // actions
    $reset,
    fetchEntities,
    fetchEntityById,
    getEntityById,
    createEntity,
    removeEntity,
    renameEntity,
  };
});
