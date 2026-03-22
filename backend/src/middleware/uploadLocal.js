import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Backend root: from src/middleware -> go up to backend
const uploadsBase = path.join(__dirname, '..', '..', 'uploads');
const productsDir = path.join(uploadsBase, 'products');

try {
  fs.mkdirSync(productsDir, { recursive: true });
} catch (_) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, productsDir),
  filename: (req, file, cb) => {
    const name = (file.originalname || 'image').replace(/[/\\]/g, '-');
    cb(null, Date.now() + '-' + name);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images (jpeg, png, gif, webp) allowed'), false);
  },
});
