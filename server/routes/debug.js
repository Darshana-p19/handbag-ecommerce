const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/file-check', (req, res) => {
  const uploadPath = path.join(__dirname, 'upload.js');
  const content = fs.readFileSync(uploadPath, 'utf8');
  res.json({
    file_exists: fs.existsSync(uploadPath),
    first_200_chars: content.substring(0, 200),
    contains_axios: content.includes('axios'),
    contains_upload_preset: content.includes('upload_preset'),
    file_size: content.length
  });
});

module.exports = router;
