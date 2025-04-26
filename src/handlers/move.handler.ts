import * as vscode from "vscode";
import {
  SuiMoveNew,
  SuiMoveBuild,
  SuiMoveTest
} from "../services/sui.service";
import { MoveInitRequest } from "../types/move/init.type";
import { getWorkSpacePath } from "../utils/path";
import { validateWorkspace } from "../utils/workspace.check";

export async function HandleMoveNew(
  webview: vscode.Webview,
  data: MoveInitRequest
) {
  console.log("Handling MoveNew", data);
  if (validateWorkspace(webview) === false) {
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

export async function HandleMoveBuild(
  webview: vscode.Webview,
  data: MoveInitRequest
) {
  console.log("Handling MoveBuild");
  if (validateWorkspace(webview) === false) {
    return;
  }
  try {
    const result = await SuiMoveBuild(webview, data);
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
    const result = await SuiMoveTest(webview);
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

