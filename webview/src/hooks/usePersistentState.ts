import { useState, useEffect } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
    const getSaved = () => {
        if (typeof window === "undefined") return initialValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    };

    const [value, setValue] = useState<T>(getSaved);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);

    return [value, setValue] as const;
}