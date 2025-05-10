/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,tsx,jsx,vue}', 
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          background: 'var(--vscode-editor-background)',
          foreground: 'var(--vscode-editor-foreground)',
          inputBackground: 'var(--vscode-input-background)',
          inputForeground: 'var(--vscode-input-foreground)',
          inputBorder: 'var(--vscode-input-border)',
          buttonBackground: 'var(--vscode-button-background)',
          buttonForeground: 'var(--vscode-button-foreground)',
          buttonHoverBackground: "var(--vscode-button-hoverBackground, #1177bb)",
          errorForeground: 'var(--vscode-errorForeground)',
          focusBorder: 'var(--vscode-focusBorder)',
          editorWidgetBorder: 'var(--vscode-editorWidget-border)',
          selectionBackground: 'var(--vscode-editor-selectionBackground)',
          editorForeground: 'var(--vscode-editor-foreground)',
        }
      },
      borderColor: {
        DEFAULT: 'var(--vscode-editorWidget-border)',
      },
      textColor: {
        DEFAULT: 'var(--vscode-editor-foreground)',
      },
      backgroundColor: {
        DEFAULT: 'var(--vscode-editor-background)',
      },
    },
  },
  plugins: [],
}
