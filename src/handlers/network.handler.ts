import * as vscode from "vscode";
import { SuiClientEnvs, SuiClientSwitch, SuiClientNewEnv } from "../services/sui.service";

export async function HandleFetchEnvironments(webview: vscode.Webview) {
    try {
        console.log("Handler: Fetching environments...");
        const result = await SuiClientEnvs();
        console.log("Handler: Got environments:", result);
        webview.postMessage({
            type: "moveStatus",
            status: "success",
            data: {
                environments: result.list,
                activeEnv: result.active
            }
        });
    } catch (error: any) {
        console.error("Handler: Error fetching environments:", error);
        webview.postMessage({ 
            type: "moveStatus", 
            status: "error", 
            message: error.message 
        });
    }
}

export async function HandleSwitchEnvironment(webview: vscode.Webview, env: string) {
    try {
        console.log("Handler: Switching environment to:", env);
        await SuiClientSwitch(env);
        console.log("Handler: Switch successful");
        webview.postMessage({ 
            type: "moveStatus", 
            status: "success",
            data: { activeEnv: env }
        });
    } catch (error: any) {
        console.error("Handler: Error switching environment:", error);
        webview.postMessage({ 
            type: "moveStatus", 
            status: "error", 
            message: error.message 
        });
    }
}

export async function HandleNewEnvironment(webview: vscode.Webview, data: { alias: string, rpc: string }) {
    try {
        console.log("Handler: Adding new environment:", data);
        await SuiClientNewEnv(data.alias, data.rpc);
        console.log("Handler: Environment added successfully");
        webview.postMessage({ 
            type: "moveStatus",
            status: "success",
            message: "Environment added successfully"
        });
    } catch (error: any) {
        console.error("Handler: Error adding environment:", error);
        webview.postMessage({ 
            type: "moveStatus", 
            status: "error", 
            message: error.message 
        });
    }
}