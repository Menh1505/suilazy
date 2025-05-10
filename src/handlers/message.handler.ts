import * as vscode from "vscode";
import { HandleSuiVersion } from "./command.handler";
import { HandleClientPublish } from "./client.handler";
import { SuiMessage, SuiCommand } from "../types/sui.message";
import { SuiUpdateCli } from "../services/sui.service";
import { SuiMoveBuild } from "../services/move/build.service";
import {
  SuiClientEnvs,
  SuiClientNewEnv,
  SuiClientSwitch,
} from "../services/client/network.service";
import { SuiMoveNew } from "../services/move/new.service";
import { SuiMoveTest } from "../services/move/test.service";
import { createFileSystem } from "../lib/filesystem";

export function ReceiveMessageHandler(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  message: SuiMessage
) {
  switch (message.command) {
    case SuiCommand.VERSION:
      HandleSuiVersion(webview);
      break;
    case SuiCommand.MOVE_NEW:
      if (
        typeof message.data === "object" &&
        message.data !== null &&
        "projectName" in message.data
      ) {
        SuiMoveNew(webview, message.data);
      } else {
        webview.postMessage({
          type: "error",
          message: "Invalid data for MOVE_NEW command",
        });
      }
      break;
    case SuiCommand.MOVE_BUILD:
      SuiMoveBuild(webview, message.data);
      break;
    case SuiCommand.MOVE_TEST:
      SuiMoveTest(webview);
      break;
    case SuiCommand.MOVE_PUBLISH:
      HandleClientPublish(webview);
      break;
    case SuiCommand.UPDATE_CLI:
      HandleCliUpdate(webview);
      break;
    case SuiCommand.CLIENT_ENVS:
      SuiClientEnvs(webview);
      break;
    case SuiCommand.CLIENT_SWITCH:
      console.log("check newwork env", message.data.env);
      if (typeof message.data.env === "string") {
        console.log("check newwork trong", message.data);

        SuiClientSwitch(webview, message.data.env);
      } else {
        webview.postMessage({
          type: "error",
          message: "Invalid environment name",
        });
      }
      break;
    case SuiCommand.CLIENT_NEW_ENV:
      if (
        typeof message.data === "object" &&
        message.data !== null &&
        "alias" in message.data &&
        "rpc" in message.data
      ) {
        SuiClientNewEnv(
          webview,
          message.data as { alias: string; rpc: string }
        );
      } else {
        webview.postMessage({
          type: "error",
          message: "Invalid environment data",
        });
      }
      break;
    case SuiCommand.GET_FILES: {
      const fileSystem = createFileSystem(extensionUri);
      const allFiles = fileSystem.getAllFiles();
      webview.postMessage({
        type: "cliStatus",
        files: allFiles,
      });
      break;
    }
  }
}

async function HandleCliUpdate(webview: vscode.Webview) {
  try {
    const result = await SuiUpdateCli();
    webview.postMessage({
      type: "moveStatus",
      status: "success",
      message: result,
    });
  } catch (error: any) {
    webview.postMessage({
      type: "moveStatus",
      status: "error",
      message: error.message,
    });
  }
}
