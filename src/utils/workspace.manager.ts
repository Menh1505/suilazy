import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { validateWorkspace } from "./workspace.check";

export interface WorkspaceMessage {
  type: string;
  status: "error" | "success" | "warning";
  message: string;
}

export interface WorkspaceResult {
  path: string | null;
  message: string | null;
}

/**
 * Get the target folder path from the workspace
 * @param webview VSCode webview to send messages
 * @returns An object containing the path and a message (if any)
 */
export function getCurrentWorkspaceFolder(
  webview: vscode.Webview
): WorkspaceResult {
  // Validate workspace first
  if (!validateWorkspace(webview)) {
    return {
      path: null,
      message:
        "No workspace folder detected. Please use 'sui move new' to create a new Sui project.",
    };
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;

  console.log("Workspace folders:", workspaceFolders);

  // Get active file path
  const activeFile = vscode.window.activeTextEditor?.document.uri;
  console.log("Active file:", activeFile);

  if (activeFile) {
    const activeFolder = vscode.workspace.getWorkspaceFolder(activeFile);
    console.log("Active folder:", activeFolder);

    if (activeFolder) {
      const activeFolderPath = activeFolder.uri.fsPath;
      console.log("Active folder path:", activeFolderPath);

      // Get the directory containing the active file
      const fileDir = path.dirname(activeFile.fsPath);
      console.log("Directory containing the active file:", fileDir);

      // Check if the file directory is within the active folder
      if (fileDir.startsWith(activeFolderPath)) {
        console.log("Using directory containing the active file:", fileDir);
        return { path: fileDir, message: null };
      }

      // If the file directory is not within the active folder, use the active folder
      console.log(
        "File directory is not within the active folder. Using active folder:",
        activeFolderPath
      );
      return { path: activeFolderPath, message: null };
    }
  }

  // If there's only one folder, use it
  if (workspaceFolders && workspaceFolders.length === 1) {
    const singleFolderPath = workspaceFolders[0].uri.fsPath;
    console.log("Single folder path:", singleFolderPath);
    return { path: singleFolderPath, message: null };
  }

  // If multiple folders, send message to open a file
  const warningMessage =
    "Multiple folders detected in workspace. Please open a file in your target folder.";
  console.warn(warningMessage);
  webview.postMessage({
    type: "moveStatus",
    status: "warning",
    message: warningMessage,
  });

  return { path: null, message: warningMessage };
}
