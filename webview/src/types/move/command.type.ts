export type SuiCommandType = {
    Version: "sui.version";
    MOVE_NEW: "sui.move.new";
    MOVE_BUILD: "sui.move.build";
    MOVE_TEST: "sui.move.test";
    MOVE_PUBLISH: "sui.move.publish";
};

export const SuiCommand: SuiCommandType = {
    Version: "sui.version",
    MOVE_NEW: "sui.move.new",
    MOVE_BUILD: "sui.move.build",
    MOVE_TEST: "sui.move.test",
    MOVE_PUBLISH: "sui.move.publish",
} as const;