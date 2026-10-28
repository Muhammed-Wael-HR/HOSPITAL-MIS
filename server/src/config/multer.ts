// =============================================================
// Multer Configuration
// File upload handling with storage and validation
// =============================================================

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

/** Upload directory from environment or default */
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Storage configuration - saves files with unique names
 * organized by date subdirectories
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Create date-based subdirectory (YYYY/MM)
    const now = new Date();
    const subDir = path.join(
      uploadDir,
      now.getFullYear().toString(),
      (now.getMonth() + 1).toString().padStart(2, '0')
    );
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    cb(null, subDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename preserving extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

/** Allowed MIME types for upload */
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/tiff',
  // PDFs
  'application/pdf',
  // DICOM
  'application/dicom',
  'application/octet-stream', // DICOM files often have this MIME type
  // Documents
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

/** Max file size: 50MB */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * File filter - validates uploaded file types
 */
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: images, PDFs, DICOM, documents.`));
  }
};

/** Configured multer instance */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default upload;
