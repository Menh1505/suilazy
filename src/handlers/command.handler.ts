import * as vscode from 'vscode';
import { SuiVersion } from '../services/sui.service';

export async function HandleSuiVersion(webview: vscode.Webview) {
    const version = await SuiVersion();
    console.log('version: ', version);
    if (version?.toString().includes('not found')) {
        webview.postMessage({
            type: 'cliStatus',
            status: 'error',
            message: 'SUI not found'
        });
    }

    webview.postMessage({
        type: 'cliStatus',
        status: 'success',
        message: version
    });
}