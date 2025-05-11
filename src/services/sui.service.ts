import { promisify } from "util";
import { exec } from "child_process";
import * as vscode from "vscode";
import * as path from "path";
import processCLI from "./excute";
import { getCurrentWorkspaceFolder } from "../utils/workspace.manager";

const execAsync = promisify(exec);

// Keep track of current project directory
let currentProjectDir: string | null = null;

interface VersionInfo {
  version: string;
  warnings?: string[];
}

export async function getWorkingDirectory(): Promise<string> {
  if (currentProjectDir) {
    return currentProjectDir;
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }

  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    title: "Select Working Directory",
  });

  if (folderUri && folderUri.length > 0) {
    return folderUri[0].fsPath;
  }

  throw new Error("Please select a working directory");
}

export async function setCurrentProjectDir(
  projectName: string,
  parentDir: string
) {
  currentProjectDir = path.join(parentDir, projectName);
  console.log("Set current project directory to:", currentProjectDir);
}

export async function SuiVersion(): Promise<VersionInfo> {
  try {
    const { stdout, stderr } = await execAsync("sui --version");
    return {
      version: stdout.trim(),
      warnings: stderr ? [stderr.trim()] : undefined,
    };
  } catch (error) {
    return { version: "not found" };
  }
}

// Add version check function
async function checkVersionCompatibility(): Promise<string[]> {
  try {
    const { stderr } = await execAsync("sui client publish --dry-run");
    const warnings: string[] = [];
    if (stderr) {
      const lines = stderr.split("\n");
      lines.forEach((line) => {
        if (line.includes("[warning]")) {
          warnings.push(line.replace("[warning]", "").trim());
        }
      });
    }
    return warnings;
  } catch (error: any) {
    return [];
  }
}

// export async function SuiCLientPublish(
//   webview: vscode.Webview
// ): Promise<string> {
//   const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
//   console.log("Handling MovePublish:", workspacePath);

//   if (!workspacePath) {
//     throw new Error(message || "No workspace path found.");
//   }

//   const command = "sui";
//   const cmdArgs: string[] = ["client", "publish"];
//   cmdArgs.push("--gas-budget", "100000000"); // Default gas budget

//   try {
//     // Check version compatibility first
//     const warnings = await checkVersionCompatibility();
//     console.log("Version compatibility check warnings:", warnings);

//     // Execute publish command
//     const output = await processCLI(command, cmdArgs, workspacePath);
//     console.log("✅ CLI output:", output);

//     // Parse and format the output
//     const formattedOutput = parsePublishOutput(output, warnings);

//     // Send success status to webview
//     webview.postMessage({
//       type: "moveStatus",
//       status: "success",
//       message: formattedOutput,
//     });

//     return formattedOutput;
//   } catch (error: any) {
//     console.error("❌ CLI error:", error);

//     // Send error status to webview
//     webview.postMessage({
//       type: "moveStatus",
//       status: "error",
//       message: `Failed to publish Move project: ${error.message}`,
//     });
//   }
// }

function parsePublishOutput(output: string, warnings: string[]): string {
  let result = output;

  // Add any version mismatch warnings at the beginning
  if (warnings.length > 0) {
    result = warnings.join("\n") + "\n\n" + result;
  }

  return result;
}

export async function SuiUpdateCli(): Promise<string> {
  try {
    const workingDir = await getWorkingDirectory();
    const { stdout, stderr } = await execAsync(
      "cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui",
      { cwd: workingDir }
    );

    if (stderr) {
      console.log("Update stderr:", stderr);
    }

    return "Sui CLI updated successfully. Please restart VS Code.";
  } catch (error: any) {
    throw new Error(`Failed to update Sui CLI: ${error.message}`);
  }
}
