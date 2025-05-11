import * as vscode from "vscode";
import { getCurrentWorkspaceFolder } from "../../utils/workspace.manager";
import processCLI from "../excute";

export async function SuiMoveTest(webview: vscode.Webview): Promise<void> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling MoveTest:", workspacePath);

  if (!workspacePath) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: message || "No workspace path found.",
    });
    return;
  }

  const command = "sui";
  const cmdArgs: string[] = ["move", "test"];

  console.log("Executing command:", command, cmdArgs.join(" "));

  try {
    const output = await processCLI(command, cmdArgs, workspacePath);
    console.log("✅ CLI output:", output);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Test completed successfully. ${output}`,
    });
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Failed to test Move project: ${error}`,
    });
  }
}
