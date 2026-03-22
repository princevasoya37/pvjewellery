import multer from 'multer';
import { cloudinary, isConfigured } from '../config/cloudinary.js';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images (jpeg, png, gif, webp) allowed'), false);
  },
});

export async function uploadToCloudinary(buffer, folder = 'products') {
  if (!isConfigured) throw new Error('Cloudinary is not configured');
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    uploadStream.end(buffer);
  });
}
