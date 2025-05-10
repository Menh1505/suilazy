import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
    interface Window {
        acquireVsCodeApi: any;
    }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : undefined;

export function usePersistRoute() {
    const location = useLocation();

    useEffect(() => {
        if (!vscode) return;
        const oldState = vscode.getState?.() ?? {};
        vscode.setState({ ...oldState, pathname: location.pathname });
    }, [location.pathname]);
}