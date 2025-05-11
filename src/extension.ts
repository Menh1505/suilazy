import * as vscode from 'vscode';
import { ViewProvider } from './providers/view.provider';
import { initializeStorageProvider } from './providers/storage.provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	 // Initialize the StorageProvider singleton
	initializeStorageProvider(context);
	
	const viewProvider = new ViewProvider(context);
	
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(ViewProvider.viewType, viewProvider));

}

// This method is called when your extension is deactivated
export function deactivate() { }
