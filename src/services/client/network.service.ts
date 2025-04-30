import { getCurrentWorkspaceFolder } from "../../utils/workspace.manager";
import * as vscode from "vscode";
import processCLI from "../excute";

export async function SuiClientSwitch(
  webview: vscode.Webview,
  env: string
): Promise<string> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling Switch Environment:", workspacePath);

  if (!workspacePath) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: message || "No workspace path found.",
    });
    throw new Error(message || "No workspace path found.");
  }

  console.log("Switching to environment:", env);
  try {
    const output = await processCLI(
      "sui",
      ["client", "switch", "--env", env],
      workspacePath
    );
    console.log("✅ CLI output:", output);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: `Switched to environment ${env} successfully`,
    });
    return output;
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Failed to switch environment: ${error}`,
    });
    throw new Error(`Failed to switch environment: ${error}`);
  }
}

export async function SuiClientEnvs(webview: vscode.Webview): Promise<void> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling List Environments:", workspacePath);

  if (!workspacePath) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: message || "No workspace path found.",
    });
    throw new Error(message || "No workspace path found.");
  }

  console.log("Listing environments");
  try {
    const output = await processCLI("sui", ["client", "envs"], workspacePath);
    console.log("✅ CLI output:", output);
    const lines = output.split("\n").filter((line) => line.trim());
    const envs = lines.slice(1).map((line) => {
      const [alias, url, active] = line.split("|").map((s) => s.trim());
      return { alias, url, active: active === "*" };
    });
    const activeEnv = envs.find((env) => env.active)?.alias || "";
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: "Environments listed successfully",
      data: {
        environments: envs,
        activeEnv: activeEnv,
      },
    });
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Failed to list environments: ${error}`,
    });
  }
}

export async function SuiClientNewEnv(
  webview: vscode.Webview,
  data: { alias: string; rpc: string }
): Promise<void> {
  const { path: workspacePath, message } = getCurrentWorkspaceFolder(webview);
  console.log("Handling New Environment:", workspacePath);

  if (!workspacePath) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: message || "No workspace path found.",
    });
    throw new Error(message || "No workspace path found.");
  }

  console.log("Adding new environment:", data);
  try {
    const output = await processCLI(
      "sui",
      ["client", "new-env", `--alias=${data.alias}`, `--rpc=${data.rpc}`],
      workspacePath
    );
    console.log("✅ CLI output:", output);
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: "Environment added successfully",
    });
  } catch (error) {
    console.error("❌ CLI error:", error);
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: `Failed to add new environment: ${error}`,
    });
  }
}
