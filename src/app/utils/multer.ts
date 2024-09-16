// src/app/utils/multer.ts

import multer, { StorageEngine } from 'multer';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

// Define storage for the files
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: any, file: any, cb) {
    cb(null, path.join(process.cwd(), 'public/uploads')); // specify the directory for uploads
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // specify the filename format
  }
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit files to 5MB
  fileFilter: function (req: any, file: any, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

export const uploadMiddleware = upload.single('images');

// Helper function to use `multer` middleware with Next.js API routes
export const runMiddleware = (req: NextRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};
