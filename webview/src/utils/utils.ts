import { SuiCommandValues, SuiCommand } from "../types/move/command.type";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SuiMessage = {
  command: SuiCommandValues;
  data?: unknown;
};

export interface vscodeApi {
  postMessage(message: SuiMessage): void;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { SuiCommand };
