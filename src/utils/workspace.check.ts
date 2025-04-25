import * as vscode from "vscode";

export interface WorkspaceValidateMessage {
  type: string;
  status: "error" | "success";
  message: string;
}

/**
 * Validates current workspace state and sends error message if invalid
 * @param webview VSCode webview to send messages to
 * @returns boolean indicating if workspace is valid
 */
export function validateWorkspace(webview: vscode.Webview): boolean {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    const message: WorkspaceValidateMessage = {
      type: "moveStatus",
      status: "error",
      message:
        "No workspace open. Please open a workspace before creating a project.",
    };

    webview.postMessage(message);
    return false;
  }

  return true;
}
