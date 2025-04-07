import { promisify } from "util";
import { exec } from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

const execAsync = promisify(exec);

// Keep track of current project directory
let currentProjectDir: string | null = null;

interface VersionInfo {
    version: string;
    warnings?: string[];
}

async function getWorkingDirectory(): Promise<string> {
    if (currentProjectDir) {
        return currentProjectDir;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }

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

export async function setCurrentProjectDir(projectName: string, parentDir: string) {
    currentProjectDir = path.join(parentDir, projectName);
    console.log("Set current project directory to:", currentProjectDir);
}

export async function SuiVersion(): Promise<VersionInfo> {
    try {
        const { stdout, stderr } = await execAsync('sui --version');
        return {
            version: stdout.trim(),
            warnings: stderr ? [stderr.trim()] : undefined
        };
    } catch (error) {
        return { version: 'not found' };
    }
}

// Add version check function
async function checkVersionCompatibility(): Promise<string[]> {
    try {
        const { stderr } = await execAsync('sui client publish --dry-run');
        const warnings: string[] = [];
        if (stderr) {
            const lines = stderr.split('\n');
            lines.forEach(line => {
                if (line.includes('[warning]')) {
                    warnings.push(line.replace('[warning]', '').trim());
                }
            });
        }
        return warnings;
    } catch (error: any) {
        return [];
    }
}

export async function SuiMoveNew(projectName: string): Promise<string> {
    const parentDir = await getWorkingDirectory();
    console.log("Parent directory:", parentDir);
    
    try {
        const { stdout, stderr } = await execAsync(`sui move new ${projectName}`, {
            cwd: parentDir
        });
        
        if (stderr && !stderr.includes('Creating')) {
            throw new Error(stderr);
        }

        // Set current project directory after successful creation
        await setCurrentProjectDir(projectName, parentDir);
        
        return stdout || "Project created successfully";
    } catch (error: any) {
        console.error("Error creating project:", error);
        throw new Error(`Failed to create Move project: ${error.message}`);
    }
}

export async function SuiMoveBuild(): Promise<string> {
    if (!currentProjectDir) {
        throw new Error('No active project directory. Please create or open a project first.');
    }
    
    console.log("Building in directory:", currentProjectDir);
    try {
        const { stdout, stderr } = await execAsync('sui move build', {
            cwd: currentProjectDir
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
    if (!currentProjectDir) {
        throw new Error('No active project directory. Please create or open a project first.');
    }
    
    console.log("Testing in directory:", currentProjectDir);
    try {
        const { stdout, stderr } = await execAsync('sui move test', {
            cwd: currentProjectDir
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
    if (!currentProjectDir) {
        throw new Error('No active project directory. Please create or open a project first.');
    }
    
    // Check version compatibility first
    const warnings = await checkVersionCompatibility();
    
    console.log("Publishing from directory:", currentProjectDir);
    try {
        const { stdout, stderr } = await execAsync('sui client publish --gas-budget 100000000', {
            cwd: currentProjectDir
        });
        
        // Include warnings in the success message if they exist
        if (warnings.length > 0) {
            return `${stdout}\n\nWarnings:\n${warnings.join('\n')}`;
        }
        
        return stdout;
    } catch (error: any) {
        const errorMsg = error.message || 'Unknown error';
        if (warnings.length > 0) {
            throw new Error(`Failed to publish Move project. \n\nWarnings:\n${warnings.join('\n')}\n\nError:\n${errorMsg}`);
        }
        throw new Error(`Failed to publish Move project: ${errorMsg}`);
    }
}

export async function SuiUpdateCli(): Promise<string> {
    try {
        // For Linux/MacOS
        const { stdout, stderr } = await execAsync('cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui');
        
        if (stderr) {
            console.log("Update stderr:", stderr);
        }
        
        return "Sui CLI updated successfully. Please restart VS Code.";
    } catch (error: any) {
        throw new Error(`Failed to update Sui CLI: ${error.message}`);
    }
}