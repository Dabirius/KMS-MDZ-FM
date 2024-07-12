// Exclude keys
export function excludePropertiesFromObject<T, Key extends keyof T>(
  document: T,
  keys: Key[],
): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<T, Key>;
}
