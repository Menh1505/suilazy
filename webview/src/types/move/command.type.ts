export type SuiCommandType = {
  VERSION: "sui.version";
  MOVE_NEW: "sui.move.new";
  MOVE_BUILD: "sui.move.build";
  MOVE_TEST: "sui.move.test";
  MOVE_PUBLISH: "sui.move.publish";
  UPDATE_CLI: "sui.update";
  CLIENT_ENVS: "sui.client.envs";
  CLIENT_SWITCH: "sui.client.switch";
  CLIENT_NEW_ENV: "sui.client.new-env";
  GET_FILES: "getfiles";
};

export const SuiCommand: SuiCommandType = {
  VERSION: "sui.version",
  MOVE_NEW: "sui.move.new",
  MOVE_BUILD: "sui.move.build",
  MOVE_TEST: "sui.move.test",
  MOVE_PUBLISH: "sui.move.publish",
  UPDATE_CLI: "sui.update",
  CLIENT_ENVS: "sui.client.envs",
  CLIENT_SWITCH: "sui.client.switch",
  CLIENT_NEW_ENV: "sui.client.new-env",
  GET_FILES: "getfiles",
} as const;

export type SuiCommandValues = SuiCommandType[keyof SuiCommandType];
