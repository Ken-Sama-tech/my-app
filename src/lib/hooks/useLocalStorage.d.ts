import type { Key, Value, LocalStorageResponse } from "./types/useLocalStorage";
declare const useLocalStorage: () => {
    get: <T>(key: Key) => LocalStorageResponse & {
        data?: T | null | undefined;
    };
    set: (key: Key, value: Value) => LocalStorageResponse & {
        data?: string | null | undefined;
    };
    del: (key: Key) => LocalStorageResponse & {
        data?: string | null | undefined;
    };
    clear: () => LocalStorageResponse & {
        data?: string | null | undefined;
    };
};
export default useLocalStorage;
