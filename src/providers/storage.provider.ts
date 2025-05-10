import * as vscode from 'vscode';

export type StorageScope = 'workspace' | 'global' | 'secret';

export class StorageProvider {
    constructor(private context: vscode.ExtensionContext) { }

    async set<T>(key: string, value: T, scope: StorageScope = 'workspace'): Promise<void> {
        switch (scope) {
            case 'workspace':
                await this.context.workspaceState.update(key, value);
                break;
            case 'global':
                await this.context.globalState.update(key, value);
                break;
            case 'secret':
                await this.context.secrets.store(key, JSON.stringify(value));
                break;
        }
    }

    async get<T>(key: string, scope: StorageScope = 'workspace', defaultValue?: T): Promise<T | undefined> {
        switch (scope) {
            case 'workspace':
                return this.context.workspaceState.get<T>(key, defaultValue as T);
            case 'global':
                return this.context.globalState.get<T>(key, defaultValue as T);
            case 'secret': {
                const val = await this.context.secrets.get(key);
                try {
                    return val ? JSON.parse(val) as T : defaultValue;
                } catch {
                    return defaultValue;
                }
            }
        }
    }

    async delete(key: string, scope: StorageScope = 'workspace'): Promise<void> {
        switch (scope) {
            case 'workspace':
                await this.context.workspaceState.update(key, undefined);
                break;
            case 'global':
                await this.context.globalState.update(key, undefined);
                break;
            case 'secret':
                await this.context.secrets.delete(key);
                break;
        }
    }
}