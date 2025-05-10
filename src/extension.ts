import * as vscode from 'vscode';
import { ViewProvider } from './providers/view.provider';
import { StorageProvider } from './providers/storage.provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const viewProvider = new ViewProvider(context);
	const storageProvider = new StorageProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(ViewProvider.viewType, viewProvider));

}

// This method is called when your extension is deactivated
export function deactivate() { }
