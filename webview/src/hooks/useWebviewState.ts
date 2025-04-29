import { useState, useEffect } from "react";

declare global {
    interface Window {
        acquireVsCodeApi: any;
    }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : undefined;

export function useWebviewState<T>(key: string, initialValue: T) {
    const getSavedState = () => {
        if (!vscode) return initialValue;
        const state = vscode.getState();
        return state?.[key] ?? initialValue;
    };

    const [value, setValue] = useState<T>(getSavedState);

    useEffect(() => {
        if (!vscode) return;
        const state = vscode.getState() ?? {};
        vscode.setState({ ...state, [key]: value });
    }, [key, value]);

    return [value, setValue] as const;
}