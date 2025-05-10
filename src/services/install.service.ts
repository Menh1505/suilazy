import * as os from 'os';

enum OS {
    MAC = 1, // darwin
    WINDOWS = 2, // windows
    UBUNTU = 3, // ubuntu
    OTHER = 4, // debian
}

function getOS(): OS {
    const platform = os.platform();
    if (platform === 'linux') {
        try {
            const { execSync } = require('child_process');
            const distro = JSON.parse(execSync('hostnamectl --json=short').toString().trim());
            console.log('Distro:', distro.KernelVersion);
            if (distro.KernelVersion.toString().includes('Ubuntu')) {
                return OS.UBUNTU;
            } else {
                return OS.OTHER;
            }
        }
        catch {
            return OS.OTHER;
        }
    } else if (platform.toString().includes('win')) {
        return OS.WINDOWS;
    } else if (platform.toString().includes('darwin')) {
        return OS.MAC;
    } else {
        return OS.OTHER;
    }
}

console.log('Current OS:', getOS());