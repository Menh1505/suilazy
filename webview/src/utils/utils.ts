type SuiMessage = {
    command: "sui.version"
}

export interface vscodeApi {
    postMessage(message: SuiMessage) : void;
}