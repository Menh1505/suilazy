import * as vscode from "vscode";
import { HandleSuiVersion } from "./command.handler";
import { HandleMoveNew, HandleMoveBuild, HandleMoveTest } from "./move.handler";
import { HandleClientPublish } from "./client.handler";
import {
  HandleFetchEnvironments,
  HandleSwitchEnvironment,
  HandleNewEnvironment,
} from "./network.handler";
import { SuiMessage, SuiCommand } from "../types/sui.message";
import { SuiUpdateCli } from "../services/sui.service";

export function ReceiveMessageHandler(
  webview: vscode.Webview,
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
        HandleMoveNew(webview, message.data);
      } else {
        webview.postMessage({
          type: "error",
          message: "Invalid data for MOVE_NEW command",
        });
      }
      break;
    case SuiCommand.MOVE_BUILD:
      HandleMoveBuild(webview, message.data);
      break;
    case SuiCommand.MOVE_TEST:
      HandleMoveTest(webview);
      break;
    case SuiCommand.MOVE_PUBLISH:
      HandleClientPublish(webview);
      break;
    case SuiCommand.UPDATE_CLI:
      HandleCliUpdate(webview);
      break;
    case SuiCommand.CLIENT_ENVS:
      HandleFetchEnvironments(webview);
      break;
    case SuiCommand.CLIENT_SWITCH:
      console.log("check newwork env", message.data.env);
      if (typeof message.data.env === "string") {
        console.log("check newwork trong", message.data);

        HandleSwitchEnvironment(webview, message.data.env);
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
        HandleNewEnvironment(
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
