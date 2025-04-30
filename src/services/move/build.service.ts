import { getCurrentWorkspaceFolder } from "../../utils/workspace.manager";
import * as vscode from "vscode";
import * as path from "path";
import { MoveInitRequest } from "../../types/move/init.type";
import processCLI from "../excute";
export async function SuiMoveBuild(
  webview: vscode.Webview,
  data: MoveInitRequest
): Promise<void> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling MoveBuild:", workspacePath);

  if (!workspacePath) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: message || "No workspace path found.",
    });
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
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Build completed successfully. ${output}`,
    });
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Sui move build failed: ${error}`,
    });
  }
}
