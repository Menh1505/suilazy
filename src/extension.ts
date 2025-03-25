import * as vscode from 'vscode';
import { ViewProvider } from './providers/view.provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new ViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(ViewProvider.viewType, provider));

}

// This method is called when your extension is deactivated
export function deactivate() { }
