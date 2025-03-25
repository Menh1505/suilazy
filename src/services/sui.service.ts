import { promisify } from "util"
import { exec } from 'child_process'

const execAsync = promisify(exec);

export async function SuiVersion(): Promise<String> {
    try {
        const { stdout, stderr } = await execAsync('sui --version');
        return stdout + stderr ;
    } catch (error) {
        return 'not found';
    }
}