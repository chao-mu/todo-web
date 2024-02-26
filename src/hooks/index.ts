import type { PersistedLegacyTask } from "@/db";

export function useAppData() {
  return {
    tasks: [] as PersistedLegacyTask[],
  };
}
