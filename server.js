require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('views'));

// Baca API Key dari file atau gunakan default dari .env
const apiKeyFile = './apikey.json';
let apiKey = process.env.OPENAI_API_KEY;

if (fs.existsSync(apiKeyFile)) {
    apiKey = JSON.parse(fs.readFileSync(apiKeyFile, 'utf-8')).apiKey;
}

// Endpoint untuk mengambil API Key
app.get('/apikey', (req, res) => {
    res.json({ apiKey });
});

// Endpoint untuk mengupdate API Key
app.post('/apikey', (req, res) => {
    if (!req.body.apiKey) return res.status(400).json({ error: "API Key diperlukan" });

    apiKey = req.body.apiKey;
    fs.writeFileSync(apiKeyFile, JSON.stringify({ apiKey }));
    res.json({ message: "API Key berhasil diperbarui!" });
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
