import { vscodeApi } from './utils/utils';

export { };

declare global {
    interface Window {
        vscode: vscodeApi;
    }
}