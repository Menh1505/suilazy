export type SuiCommandType = {
    VERSION: "sui.version";
    MOVE_NEW: "sui.move.new";
    MOVE_BUILD: "sui.move.build";
    MOVE_TEST: "sui.move.test";
    MOVE_PUBLISH: "sui.move.publish";
    UPDATE_CLI: "sui.update";
};

export const SuiCommand: SuiCommandType = {
    VERSION: "sui.version",
    MOVE_NEW: "sui.move.new",
    MOVE_BUILD: "sui.move.build",
    MOVE_TEST: "sui.move.test",
    MOVE_PUBLISH: "sui.move.publish",
    UPDATE_CLI: "sui.update"
};

export type SuiCommandValues = SuiCommandType[keyof SuiCommandType];
