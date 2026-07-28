import { BadRequestException } from "@nestjs/common";
import multer, { diskStorage } from "multer";
import path, { extname } from "path";
import * as fs from 'fs';
import { existsSync, mkdirSync } from "fs";

export const storage = (directory: string) => {
    return {
        // storage: multer({
        storage: diskStorage({
            //   destination: `./public/uploads/${directory}`,
            destination: (req, file, callback) => {

                const uploadPath = `./public/uploads/${directory}`;

                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, {
                        recursive: true,
                    });
                }

                callback(null, uploadPath);
            },

            filename: (req, file, callback) => {
                if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}${ext}`;
                    callback(null, filename);
                } else {
                    callback(
                        new BadRequestException(
                            'Invalid file type. Only PNG, JPG, and JPEG formats are allowed.',
                        ),
                        'trash.trash',
                    );
                }
            },
        }),
        limits: { fileSize: 10485760 }, // 10MB file size limit
    };
};

export const fileInfo = (file) => {
    let extension;

    if (typeof file === 'string') {
        extension = path.extname(file);
    } else if (file.filename) {
        extension = path.extname(file.filename);
    } else {
        extension = path.extname(file.originalname);
    }

    let fileName = file.filename || file.originalname || path.basename(file) || null;
    if (typeof file !== "string") {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        fileName = `${uniqueSuffix}${ext}`;
    }
    return {
        name: fileName,
        extension,
        mime_type: file.mimetype /* || mime.lookup(extension) */ || null,
        size: file.size || fs.statSync(file).size || null,
    };
};
