import { SuiMessage, SuiResponse } from './types/sui.message';

declare global {
    interface Window {
        vscode: {
            postMessage: (message: SuiMessage) => void;
            onMessage: (callback: (message: SuiResponse) => void) => void;
        }
    }
}
