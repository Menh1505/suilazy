import * as vscode from 'vscode';

export class ViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "SuilazyView";
    private static currentWebview: vscode.WebviewView | null = null;

    constructor(private readonly context: vscode.ExtensionContext) { }

    /**
     * Retrieves the current instance of the vscode.WebviewView if it exists.
     *
     * @returns {vscode.WebviewView | null} The current webview instance if it exists, otherwise null.
     */
    public static getWebview(): vscode.WebviewView | null {
        return ViewProvider.currentWebview;
    }

    /**
     * Resolves the webview view by setting up its options and HTML content.
     *
     * @param {vscode.WebviewView} webviewView - The webview view to be resolved.
     * @param {vscode.WebviewViewResolveContext} _context - The context in which the webview view is being resolved.
     * @param {vscode.CancellationToken} _token - A cancellation token.
     */
    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        ViewProvider.currentWebview = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'build'),
                vscode.Uri.joinPath(this.context.extensionUri, 'media')
            ],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => { });
    }

    /**
     * Generates the HTML content for the webview.
     *
     * @param {vscode.Webview} webview - The webview instance for which the HTML content is generated.
     * @returns {string} The HTML content to be displayed in the webview.
     */
    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'build', 'assets', 'index.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'build', 'assets', 'index.css'));
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="
default-src 'none'; 
img-src ${webview.cspSource} https: data:; 
script-src ${webview.cspSource} 'unsafe-inline'; 
style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; 
font-src ${webview.cspSource} https://fonts.gstatic.com; 
connect-src ${webview.cspSource} https://fullnode.devnet.aptoslabs.com;">
    <title>MoveLazy</title>
    <link href="${styleUri}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script>
        (function() {
            try {
                const vscode = acquireVsCodeApi();
                window.vscode = vscode;
                console.log('VSCode API initialized successfully');
            } catch (error) {
                console.error('Failed to initialize VSCode API:', error);
            }
        })();
    </script>
    
    <script type="module" src="${scriptUri}"></script>
</body>
</html>
    `;
    }
}