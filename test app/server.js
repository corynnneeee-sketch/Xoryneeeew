require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const storage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  keyFilename: process.env.GC_KEYFILE
});

const bucket = storage.bucket(process.env.GC_BUCKET);

app.use(express.static('.'));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Save text as a .txt file
    if (req.body.text) {
      const file = bucket.file(`text-${Date.now()}.txt`);
      await file.save(req.body.text);
    }

    // Save uploaded file
    if (req.file) {
      const gFile = bucket.file(req.file.originalname);
      await gFile.save(req.file.buffer);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

app.get('/files', async (req, res) => {
  const [files] = await bucket.getFiles();
  const fileData = files.map(f => ({
    name: f.name,
    url: `https://storage.googleapis.com/${process.env.GC_BUCKET}/${f.name}`
  }));
  res.json(fileData);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
