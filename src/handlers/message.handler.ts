import * as vscode from "vscode";
import { HandleSuiVersion } from "./command.handler";
import { HandleMoveNew, HandleMoveBuild, HandleMoveTest, HandleMovePublish } from "./move.handler";
import { SuiMessage, SuiCommand } from "../types/sui.message";

export function ReceiveMessageHandler(webview: vscode.Webview, message: SuiMessage) {
    switch (message.command){
        case SuiCommand.VERSION:
            HandleSuiVersion(webview);
            break;
        case SuiCommand.MOVE_NEW:
            if (typeof message.data === 'object' && message.data !== null && 'projectName' in message.data) {
                HandleMoveNew(webview, message.data as { projectName: string });
            } else {
                webview.postMessage({ type: 'error', message: 'Invalid data for MOVE_NEW command' });
            }
            break;
        case SuiCommand.MOVE_BUILD:
            HandleMoveBuild(webview);
            break;
        case SuiCommand.MOVE_TEST:
            HandleMoveTest(webview);
            break;
        case SuiCommand.MOVE_PUBLISH:
            HandleMovePublish(webview);
            break;
    }
}