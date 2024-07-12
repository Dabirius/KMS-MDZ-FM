import { CAdvisor } from "~/types/db-types";
export const useAdvisors = defineStore("Advisors", () => {
  const advisors = ref<Array<CAdvisor>>([]);
  async function fetchAdvisors(): Promise<void> {
    const { data } = await useFetch("/api/advisors");
    advisors.value = data.value || [];
  }
  return {
    // states
    advisors,
    // actions
    fetchAdvisors,
  };
});
