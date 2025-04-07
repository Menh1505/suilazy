export interface SuiResponse {
    type: 'cliStatus' | 'moveStatus';
    status: 'success' | 'error';
    message: string;
}
