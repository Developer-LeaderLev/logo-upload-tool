const express = require('express');
const multer  = require('multer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const router = express.Router();

require('dotenv').config();

const supabase = createClient(
  "https://anigfhqllnhrxhbturvs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuaWdmaHFsbG5ocnhoYnR1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njc0MTMsImV4cCI6MjA2NDU0MzQxM30.ipHycEKyFq0LycGmEUuQGowSaaY1KUUJVIPDfpKjhXc"
);

// Set up multer to save uploads temporarily to 'tmp/' folder
const upload = multer({ dest: 'tmp/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send('No file uploaded');

  const ext = path.extname(file.originalname);
  const uniqueName = `uploads/${Date.now()}-${file.originalname}`;

  try {
    const fileBuffer = fs.readFileSync(file.path);

    const { data, error } = await supabase.storage
      .from('image-upload')
      .upload(uniqueName, fileBuffer, {
        contentType: file.mimetype,
        upsert: true
      });

    fs.unlinkSync(file.path); // clean up temp file

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).send('Upload to Supabase failed');
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('image-upload')
      .getPublicUrl(uniqueName);

    res.send(`✅ File uploaded and saved to Supabase!\n\n🌐 Public URL:\n${publicUrlData.publicUrl}`);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('Unexpected error');
  }
});

module.exports = router;
