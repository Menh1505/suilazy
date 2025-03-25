import * as vscode from "vscode";
import { HandleSuiVersion } from "./command.handler";

export function ReceiveMessageHandler(webview: vscode.Webview, message: any) {
    switch (message.command){
        case 'sui.version':
            HandleSuiVersion(webview);
            break;
    }
}