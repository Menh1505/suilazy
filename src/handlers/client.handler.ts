// import * as vscode from "vscode";
// import { SuiCLientPublish } from "../services/sui.service";

// export async function HandleClientPublish(webview: vscode.Webview) {
//   console.log("Handling MovePublish");
//   try {
//     const result = await SuiCLientPublish(webview);
//     console.log("MovePublish success:", result);
//     webview.postMessage({
//       type: "moveStatus",
//       status: "success",
//       message: `Publish completed successfully. ${result}`,
//     });
//   } catch (error: any) {
//     console.error("MovePublish error:", error.message);
//     webview.postMessage({
//       type: "moveStatus",
//       status: "error",
//       message: error.message,
//     });
//   }
// }
