export const parseJsonSafe = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
