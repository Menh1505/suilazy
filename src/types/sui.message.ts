import { SuiCommandValues } from "./sui.command";

export interface SuiMessage {
  command: SuiCommandValues;
  data?: any;
}

export interface SuiResponse {
  type: "cliStatus" | "moveStatus";
  status: "success" | "error";
  message: string;
}

export { SuiCommand } from "./sui.command";
