import fs from 'fs';
import path from 'path';

async function saveImages(files: Express.Multer.File[], uniqueNumber: string) {
    return files && files.length > 0 &&  files.map(async (file) => {
        const finalName = uniqueNumber + '-' + file.originalname;
        const outDir = process.cwd() + '/src';
        const savePath = path.join(outDir, '/images/', finalName);
        fs.writeFileSync(savePath, file.buffer);
    });
}

export default saveImages;