import type { Key, Value, LocalStorageResponse } from "./types/useLocalStorage";

const useLocalStorage = () => {
  type Response<T = string> = LocalStorageResponse & {
    data?: T | null;
  };

  const get = <T,>(key: Key): Response<T> => {
    try {
      const data: string = localStorage.getItem(key) || "";
      return {
        success: true,
        data: JSON.parse(data),
        message: `Successfully fetch data of key "${key}"`,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  };

  const set = (key: Key, value: Value): Response => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return {
        success: true,
        message: `Successfully set value with key "${key}"`,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  };

  const del = (key: Key): Response => {
    try {
      localStorage.removeItem(key);
      return {
        success: true,
        message: `Successfully deleted item with key "${key}"`,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  };

  const clear = (): Response => {
    try {
      localStorage.clear();
      return {
        success: true,
        message: "Successfully clear local storage",
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  };

  return { get, set, del, clear };
};

export default useLocalStorage;
