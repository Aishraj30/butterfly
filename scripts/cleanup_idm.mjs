
import fs from 'fs';
import path from 'path';

const idmPath = path.join(process.cwd(), 'idm');

if (fs.existsSync(idmPath)) {
    try {
        fs.rmSync(idmPath, { recursive: true, force: true });
        console.log('Successfully removed idm directory');
    } catch (error) {
        console.error('Error removing idm directory:', error);
    }
} else {
    console.log('idm directory does not exist');
}
