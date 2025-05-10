import { promisify } from "util";
import { exec } from "child_process";
import * as vscode from "vscode";
import * as path from "path";
import { MoveInitRequest } from "../types/move/init.type";
import processCLI from "./excute";
import { getWorkSpacePath } from "../utils/path";
import { getCurrentWorkspaceFolder } from "../utils/workspace.manager";

const execAsync = promisify(exec);

// Keep track of current project directory
let currentProjectDir: string | null = null;

interface VersionInfo {
  version: string;
  warnings?: string[];
}

async function getWorkingDirectory(): Promise<string> {
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

export async function SuiMoveNew(data: MoveInitRequest): Promise<string> {
  const workspacePath = getWorkSpacePath();
  const { projectName, packagePath, options } = data;

  // Build command string with options
  const command = "sui";
  const cmdArgs: string[] = ["move", "new", projectName];

  // Add package path if specified
  if (packagePath) {
    cmdArgs.push(`--package-path "${packagePath}"`);
  }

  // Add all options
  if (options.dev) {
    cmdArgs.push("--dev");
  }
  if (options.test) {
    cmdArgs.push("--test");
  }
  if (options.doc) {
    cmdArgs.push("--doc");
  }
  if (options.disassemble) {
    cmdArgs.push("--disassemble");
  }
  if (options.installDir) {
    cmdArgs.push(`--install-dir "${options.installDir}"`);
  }
  if (options.force) {
    cmdArgs.push("--force");
  }
  if (options.fetchDepsOnly) {
    cmdArgs.push("--fetch-deps-only");
  }
  if (options.skipFetchLatestGitDeps) {
    cmdArgs.push("--skip-fetch-latest-git-deps");
  }
  if (options.defaultMoveFlavor) {
    cmdArgs.push(`--default-move-flavor "${options.defaultMoveFlavor}"`);
  }
  if (options.defaultMoveEdition) {
    cmdArgs.push(`--default-move-edition "${options.defaultMoveEdition}"`);
  }
  if (options.dependenciesAreRoot) {
    cmdArgs.push("--dependencies-are-root");
  }
  if (options.silenceWarnings) {
    cmdArgs.push("--silence-warnings");
  }
  if (options.warningsAreErrors) {
    cmdArgs.push("--warnings-are-errors");
  }
  if (options.jsonErrors) {
    cmdArgs.push("--json-errors");
  }
  if (options.noLint) {
    cmdArgs.push("--no-lint");
  }
  if (options.lint) {
    cmdArgs.push("--lint");
  }

  console.log("Executing command:", command, cmdArgs.join(" "));

  try {
    const output = await processCLI(command, cmdArgs, workspacePath);
    console.log("✅ CLI output:", output);
    return output;
  } catch (error) {
    console.error("❌ CLI error:", error);
    throw new Error(`Sui move failed: ${error}`);
  }
}

export async function SuiMoveBuild(
  webview: vscode.Webview,
  data: MoveInitRequest
): Promise<string> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling MoveBuild:", workspacePath);

  if (!workspacePath) {
    throw new Error(message || "No workspace path found.");
  }

  const { packagePath, options } = data;

  // Build command string with options
  const command = "sui";
  const cmdArgs: string[] = ["move", "build"];

  // Add package path if specified
  if (packagePath) {
    cmdArgs.push(`--package-path "${packagePath}"`);
  }

  // Add all options
  if (options.dev) {
    cmdArgs.push("--dev");
  }
  if (options.test) {
    cmdArgs.push("--test");
  }
  if (options.doc) {
    cmdArgs.push("--doc");
  }
  if (options.disassemble) {
    cmdArgs.push("--disassemble");
  }
  if (options.installDir) {
    cmdArgs.push(`--install-dir "${options.installDir}"`);
  }
  if (options.force) {
    cmdArgs.push("--force");
  }
  if (options.fetchDepsOnly) {
    cmdArgs.push("--fetch-deps-only");
  }
  if (options.skipFetchLatestGitDeps) {
    cmdArgs.push("--skip-fetch-latest-git-deps");
  }
  if (options.defaultMoveFlavor) {
    cmdArgs.push(`--default-move-flavor "${options.defaultMoveFlavor}"`);
  }
  if (options.defaultMoveEdition) {
    cmdArgs.push(`--default-move-edition "${options.defaultMoveEdition}"`);
  }
  if (options.dependenciesAreRoot) {
    cmdArgs.push("--dependencies-are-root");
  }
  if (options.silenceWarnings) {
    cmdArgs.push("--silence-warnings");
  }
  if (options.warningsAreErrors) {
    cmdArgs.push("--warnings-are-errors");
  }
  if (options.jsonErrors) {
    cmdArgs.push("--json-errors");
  }
  if (options.noLint) {
    cmdArgs.push("--no-lint");
  }
  if (options.lint) {
    cmdArgs.push("--lint");
  }

  console.log("Executing command:", command, cmdArgs.join(" "));

  try {
    const output = await processCLI(command, cmdArgs, workspacePath);
    console.log("✅ CLI output:", output);
    return output;
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Sui move build failed: ${error}`,
    });
    throw new Error(`Sui move build failed: ${error}`);
  }
}

export async function SuiMoveTest(webview: vscode.Webview): Promise<string> {
  const workspacePath = getCurrentWorkspaceFolder(webview);
  if (!workspacePath) {
    return "Please open a file in your target folder first";
  }

  try {
    const { stdout, stderr } = await execAsync("sui move test", {
      // cwd: workspacePath,
    });
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout;
  } catch (error: any) {
    throw new Error(`Failed to test Move project: ${error.message}`);
  }
}

export async function SuiCLientPublish(webview: vscode.Webview): Promise<string> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling MovePublish:", workspacePath);

  if (!workspacePath) {
    throw new Error(message || "No workspace path found.");
  }

  const command = "sui";
  const cmdArgs: string[] = ["client", "publish"];
  cmdArgs.push("--gas-budget", "100000000"); // Default gas budget

  try {
    // Check version compatibility first
    const warnings = await checkVersionCompatibility();
    console.log("Version compatibility check warnings:", warnings);

    // Execute publish command
    const output = await processCLI(command, cmdArgs, workspacePath);
    console.log("✅ CLI output:", output);

    // Parse and format the output
    const formattedOutput = parsePublishOutput(output, warnings);
    
    // Send success status to webview
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: formattedOutput
    });

    return formattedOutput;
  } catch (error: any) {
    console.error("❌ CLI error:", error);
    
    // Send error status to webview
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Failed to publish Move project: ${error.message}`
    });

    throw new Error(`Sui move publish failed: ${error.message}`);
  }
}

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

export async function SuiClientEnvs(): Promise<{
  list: any[];
  active: string;
}> {
  try {
    const workingDir = await getWorkingDirectory();
    const { stdout } = await execAsync("sui client envs", {
      cwd: workingDir,
    });
    const lines = stdout.split("\n").filter((line) => line.trim());
    const envs = lines.slice(1).map((line) => {
      const [alias, url, active] = line.split("|").map((s) => s.trim());
      return { alias, url, active: active === "*" };
    });
    const activeEnv = envs.find((env) => env.active)?.alias || "";
    return { list: envs, active: activeEnv };
  } catch (error: any) {
    throw new Error(`Failed to get environments: ${error.message}`);
  }
}

export async function SuiClientSwitch(env: string): Promise<string> {
  try {
    const workingDir = await getWorkingDirectory();
    const { stdout } = await execAsync(`sui client switch --env ${env}`, {
      cwd: workingDir,
    });
    return stdout;
  } catch (error: any) {
    throw new Error(`Failed to switch environment: ${error.message}`);
  }
}

export async function SuiClientNewEnv(
  alias: string,
  rpc: string
): Promise<string> {
  try {
    const workingDir = await getWorkingDirectory();
    const { stdout } = await execAsync(
      `sui client new-env --alias ${alias} --rpc ${rpc}`,
      { cwd: workingDir }
    );
    return stdout;
  } catch (error: any) {
    throw new Error(`Failed to add new environment: ${error.message}`);
  }
}
