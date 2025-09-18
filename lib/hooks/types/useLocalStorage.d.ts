export type Key = string;
export type Value = string | object | number | boolean;
export type LocalStorageResponse = {
  message: string | null;
  data?: unknown;
  error?: boolean;
  success?: boolean;
};
