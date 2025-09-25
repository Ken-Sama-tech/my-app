const useLocalStorage = () => {
    const get = (key) => {
        try {
            const data = localStorage.getItem(key) || "";
            return {
                success: true,
                data: JSON.parse(data),
                message: `Successfully fetch data of key "${key}"`,
            };
        }
        catch (error) {
            return {
                error: true,
                message: error.message,
            };
        }
    };
    const set = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return {
                success: true,
                message: `Successfully set value with key "${key}"`,
            };
        }
        catch (error) {
            return {
                error: true,
                message: error.message,
            };
        }
    };
    const del = (key) => {
        try {
            localStorage.removeItem(key);
            return {
                success: true,
                message: `Successfully deleted item with key "${key}"`,
            };
        }
        catch (error) {
            return {
                error: true,
                message: error.message,
            };
        }
    };
    const clear = () => {
        try {
            localStorage.clear();
            return {
                success: true,
                message: "Successfully clear local storage",
            };
        }
        catch (error) {
            return {
                error: true,
                message: error.message,
            };
        }
    };
    return { get, set, del, clear };
};
export default useLocalStorage;
