import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// upload file in the src/upload folder
let folderUploadPath = `../../src/upload`;
const storage = multer.diskStorage({
  destination(req, file, callback) {
    const dir = path.join(__dirname, folderUploadPath);
    fs.mkdir(dir, err => callback(null, dir))
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

// delete file in the src/upload folder
export const  deleteFile = function (fileName) {
  let filePath = path.join(__dirname, folderUploadPath, fileName);
  return fs.unlinkSync(filePath);
}

// upload function to upload the file
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.UPLOAD_FILE_SIZE_IN_MB,
  },
});