export interface MoveInitRequest {
  projectName?: string;
  packagePath?: string;
  options: {
    dev: boolean;
    test: boolean;
    doc: boolean;
    disassemble: boolean;
    installDir?: string;
    force: boolean;
    silenceWarnings: boolean;
    fetchDepsOnly: boolean;
    skipFetchLatestGitDeps: boolean;
    defaultMoveFlavor?: string;
    defaultMoveEdition?: string;
    dependenciesAreRoot: boolean;
    warningsAreErrors: boolean;
    jsonErrors: boolean;
    noLint: boolean;
    lint: boolean;
  };
}
