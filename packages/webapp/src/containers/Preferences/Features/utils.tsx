export interface SettingOption {
  group: string;
  key: string;
  value: unknown;
}

export const transferObjectOptionsToArray = (
  input: Record<string, Record<string, unknown>>,
): SettingOption[] =>
  Object.entries(input).flatMap(([group, options]) =>
    Object.entries(options).map(([key, value]) => ({ group, key, value })),
  );
