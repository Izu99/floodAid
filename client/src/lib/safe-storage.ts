export const safeStorage = {
    getItem(key: string): string | null {
        try {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(key);
            }
        } catch (e) {
            console.warn(`Failed to access localStorage for key "${key}":`, e);
        }
        return null;
    },

    setItem(key: string, value: string): void {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn(`Failed to write to localStorage for key "${key}":`, e);
        }
    },

    removeItem(key: string): void {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.warn(`Failed to remove from localStorage for key "${key}":`, e);
        }
    },
};
