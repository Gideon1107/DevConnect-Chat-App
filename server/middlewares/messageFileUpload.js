import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();


// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Allowed File Types
const allowedTypes = [
    "image/", "application/pdf", "video/", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain", "application/zip", "application/x-tar",
    "application/gzip", "application/x-7z-compressed",
    "application/x-rar-compressed", "application/x-msdownload",
    "application/x-sh", "application/json", "application/xml",
    "application/x-httpd-php", "text/x-python", "text/x-java-source",
    "text/x-c++src", "text/x-csrc", "text/javascript", "text/markdown"
  ];


// Configure multer storage with S3
const messageFileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `message_files/${moment().format('DD-MM-YYYY')}/${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Check if the file type is allowed
    if (!allowedTypes.some(type => file.mimetype.startsWith(type))) {
        const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
        error.message = "Selected file type not allowed!";
        return cb(error, false);
    }
    cb(null, true);
  },
});

export default messageFileUpload;
