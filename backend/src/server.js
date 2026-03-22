import dotenv from 'dotenv';
dotenv.config();

import config from 'config';
import { connectDB } from './config/db.js';
import app from './app.js';

const port = process.env.PORT || config.get('port');

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`PVJewelleryShop API running on port ${port}`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
