import { spawn } from "child_process";

export default function processCLI(
  command: string,
  args: string[],
  cwd: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd });
    let output = "";

    proc.stdout.on("data", (data) => {
      output += data.toString();
      console.log("Output stdout:", data.toString());
    });

    proc.stderr.on("data", (data) => {
      output += data.toString();
      console.log("Output stderr:", data.toString());
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(output);
      }
      resolve(output);
    });
  });
}
