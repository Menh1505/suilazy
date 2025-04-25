import { SuiCommandValues, SuiCommand } from "../types/move/command.type";

type SuiMessage = {
  command: SuiCommandValues;
  data?: unknown;
};

export interface vscodeApi {
  postMessage(message: SuiMessage): void;
}

export { SuiCommand };
