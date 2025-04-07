import * as vscode from 'vscode';
import { SuiMoveNew, SuiMoveBuild, SuiMoveTest, SuiMovePublish } from '../services/sui.service';

export async function HandleMoveNew(webview: vscode.Webview, data: { projectName: string }) {
    console.log("Handling MoveNew with projectName:", data.projectName);
    try {
        const result = await SuiMoveNew(data.projectName);
        webview.postMessage({ 
            type: "moveStatus", 
            status: "success", 
            message: `Project "${data.projectName}" created successfully. ${result}` 
        });
    } catch (error: any) {
        console.error("MoveNew error:", error);
        webview.postMessage({ 
            type: "moveStatus", 
            status: "error", 
            message: error.message || "Failed to create project" 
        });
    }
}

export async function HandleMoveBuild(webview: vscode.Webview) {
    console.log("Handling MoveBuild");
    try {
        const result = await SuiMoveBuild();
        console.log("MoveBuild success:", result);
        webview.postMessage({ type: "moveStatus", status: "success", message: result });
    } catch (error: any) {
        console.error("MoveBuild error:", error.message);
        webview.postMessage({ type: "moveStatus", status: "error", message: error.message });
    }
}

export async function HandleMoveTest(webview: vscode.Webview) {
    console.log("Handling MoveTest");
    try {
        const result = await SuiMoveTest();
        console.log("MoveTest success:", result);
        webview.postMessage({ type: "moveStatus", status: "success", message: result });
    } catch (error: any) {
        console.error("MoveTest error:", error.message);
        webview.postMessage({ type: "moveStatus", status: "error", message: error.message });
    }
}

export async function HandleMovePublish(webview: vscode.Webview) {
    console.log("Handling MovePublish");
    try {
        const result = await SuiMovePublish();
        console.log("MovePublish success:", result);
        webview.postMessage({ type: "moveStatus", status: "success", message: result });
    } catch (error: any) {
        console.error("MovePublish error:", error.message);
        webview.postMessage({ type: "moveStatus", status: "error", message: error.message });
    }
}
