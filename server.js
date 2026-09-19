const express = require('express');
const cors = require('cors');
const axios = require('axios');
const formData = require('form-data');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 200 * 1024 * 1024 } }); // Hỗ trợ tối đa 200MB

const app = express();
app.use(cors({ origin: '*' }));

app.post('/upload', upload.single('fileToUpload'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const form = new formData();
    form.append('reqtype', 'fileupload');
    if (req.body.userhash) form.append('userhash', req.body.userhash);
    
    // Stream trực tiếp buffer
    form.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
      timeout: 600000, // Nâng timeout lên 10 phút (600.000ms) để không bị 504
    });

    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send('Proxy Error: ' + (error.response?.data || error.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
