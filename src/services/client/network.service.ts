import { promisify } from "util";
import { exec } from "child_process";

import { getWorkingDirectory } from "../sui.service";

const execAsync = promisify(exec);

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
  console.log("Adding new environmentfasfasfasf:", alias, rpc);
  try {
    const workingDir = await getWorkingDirectory();
    const { stdout } = await execAsync(
      `sui client new-env --alias=${alias} --rpc ${rpc}`,
      { cwd: workingDir }
    );
    return stdout;
  } catch (error: any) {
    throw new Error(`Failed to add new environment: ${error.message}`);
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
