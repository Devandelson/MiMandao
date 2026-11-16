import multer, { type FileFilterCallback } from 'multer';
import type { Request } from 'express';

const filter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El recurso no coincide con los tipos: png, jpg, jpeg'));
    }
}

const upload = multer({
   storage: multer.memoryStorage(),
    fileFilter: filter,
    limits: { fileSize: 1024 * 1024 * 2 }
});

export default upload;