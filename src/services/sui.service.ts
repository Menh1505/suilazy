import { promisify } from "util";
import { exec } from 'child_process';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

async function getWorkingDirectory(): Promise<string> {
    // First try to get workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }

    // If no workspace folder, prompt user to select a folder
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        title: 'Select Working Directory'
    });

    if (folderUri && folderUri.length > 0) {
        return folderUri[0].fsPath;
    }

    throw new Error('Please select a working directory');
}

export async function SuiVersion(): Promise<String> {
    try {
        const { stdout, stderr } = await execAsync('sui --version');
        return stdout + stderr ;
    } catch (error) {
        return 'not found';
    }
}

export async function SuiMoveNew(projectName: string): Promise<string> {
    const workingDir = await getWorkingDirectory();
    console.log("Working directory:", workingDir);
    
    try {
        const { stdout, stderr } = await execAsync(`sui move new ${projectName}`, {
            cwd: workingDir
        });
        
        if (stderr && !stderr.includes('Creating')) {
            throw new Error(stderr);
        }
        
        return stdout || "Project created successfully";
    } catch (error: any) {
        console.error("Error creating project:", error);
        throw new Error(`Failed to create Move project: ${error.message}`);
    }
}

export async function SuiMoveBuild(): Promise<string> {
    const workingDir = await getWorkingDirectory();
    console.log("Working directory:", workingDir);
    
    try {
        const { stdout, stderr } = await execAsync('sui move build', {
            cwd: workingDir
        });
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error: any) {
        throw new Error(`Failed to build Move project: ${error.message}`);
    }
}

export async function SuiMoveTest(): Promise<string> {
    const workingDir = await getWorkingDirectory();
    console.log("Working directory:", workingDir);
    
    try {
        const { stdout, stderr } = await execAsync('sui move test', {
            cwd: workingDir
        });
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error: any) {
        throw new Error(`Failed to test Move project: ${error.message}`);
    }
}

export async function SuiMovePublish(): Promise<string> {
    const workingDir = await getWorkingDirectory();
    console.log("Working directory:", workingDir);
    
    try {
        const { stdout, stderr } = await execAsync('sui client publish --gas-budget 100000000', {
            cwd: workingDir
        });
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error: any) {
        throw new Error(`Failed to publish Move project: ${error.message}`);
    }
}