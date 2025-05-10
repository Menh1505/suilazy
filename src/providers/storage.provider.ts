import * as vscode from 'vscode';

/**
 * Defines the scope of storage.
 * - `workspace`: Data is stored in the workspace state.
 * - `global`: Data is stored in the global state.
 * - `secret`: Data is stored securely in the secrets storage.
 */
export type StorageScope = 'workspace' | 'global' | 'secret';

/**
 * A provider for managing storage in a VS Code extension.
 */
export class StorageProvider {
    /**
     * Creates an instance of the StorageProvider.
     * @param context The extension context provided by VS Code.
     */
    constructor(private context: vscode.ExtensionContext) { }

    /**
     * Stores a value in the specified storage scope.
     * @template T The type of the value to store.
     * @param key The key to associate with the value.
     * @param value The value to store.
     * @param scope The scope of the storage. Defaults to `'workspace'`.
     * @returns A promise that resolves when the value is stored.
     */
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

    /**
     * Retrieves a value from the specified storage scope.
     * @template T The expected type of the value.
     * @param key The key associated with the value.
     * @param scope The scope of the storage. Defaults to `'workspace'`.
     * @param defaultValue An optional default value to return if the key is not found.
     * @returns A promise that resolves to the retrieved value or the default value if not found.
     */
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

    /**
     * Deletes a value from the specified storage scope.
     * @param key The key associated with the value to delete.
     * @param scope The scope of the storage. Defaults to `'workspace'`.
     * @returns A promise that resolves when the value is deleted.
     */
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

let storageProvider: StorageProvider | undefined;

/**
 * Initializes the StorageProvider singleton.
 * @param context The extension context provided by VS Code.
 */
export function initializeStorageProvider(context: vscode.ExtensionContext) {
    if (!storageProvider) {
        storageProvider = new StorageProvider(context);
    }
}

/**
 * Gets the StorageProvider singleton instance.
 * @returns The StorageProvider instance.
 */
export function getStorageProvider(): StorageProvider {
    if (!storageProvider) {
        throw new Error('StorageProvider has not been initialized. Call initializeStorageProvider first.');
    }
    return storageProvider;
}