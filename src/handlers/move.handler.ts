import * as vscode from "vscode";
import {
  SuiMoveNew,
  SuiMoveBuild,
  SuiMoveTest,
  SuiMovePublish,
} from "../services/sui.service";
import { MoveInitRequest } from "../types/move/init.type";
import { getWorkSpacePath } from "../utils/path";

export async function HandleMoveNew(
  webview: vscode.Webview,
  data: MoveInitRequest
) {
  console.log("Handling MoveNew", data);
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message:
        "No workspace open. Please open a workspace before creating a project.",
    });
    return;
  }

  try {
    const result = await SuiMoveNew(data);
    console.log("MoveNew success:", result);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Project "${data.projectName}" created and set as active project. ${result}`,
    });
  } catch (error: any) {
    console.error("MoveNew error:", error);

    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: error.message || "Failed to create project",
    });
  }
}

export async function HandleMoveBuild(webview: vscode.Webview) {
  console.log("Handling MoveBuild");
  try {
    const result = await SuiMoveBuild();
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Build completed successfully. ${result}`,
    });
  } catch (error: any) {
    console.error("MoveBuild error:", error.message);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: error.message,
    });
  }
}

export async function HandleMoveTest(webview: vscode.Webview) {
  console.log("Handling MoveTest");
  try {
    const result = await SuiMoveTest();
    console.log("MoveTest success:", result);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Test completed successfully. ${result}`,
    });
  } catch (error: any) {
    console.error("MoveTest error:", error.message);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: error.message,
    });
  }
}

export async function HandleMovePublish(webview: vscode.Webview) {
  console.log("Handling MovePublish");
  try {
    const result = await SuiMovePublish();
    console.log("MovePublish success:", result);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Publish completed successfully. ${result}`,
    });
  } catch (error: any) {
    console.error("MovePublish error:", error.message);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: error.message,
    });
  }
}
