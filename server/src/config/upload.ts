import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directories if they don't exist
const faceUploadDir = path.join(__dirname, '../../uploads/faces');
const locationUploadDir = path.join(__dirname, '../../uploads/locations');

if (!fs.existsSync(faceUploadDir)) {
    fs.mkdirSync(faceUploadDir, { recursive: true });
}
if (!fs.existsSync(locationUploadDir)) {
    fs.mkdirSync(locationUploadDir, { recursive: true });
}

// Configure storage for face images
const faceStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, faceUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'face-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Configure storage for location images
const locationStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, locationUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'location-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
};

export const upload = multer({
    storage: locationStorage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
});

export const faceUpload = multer({
    storage: faceStorage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
});
