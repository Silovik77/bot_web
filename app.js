const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Прокси для API Amvera (ваш бот остаётся на Amvera)
const AMVERA_API = 'https://silovik-silovik.waw0.amvera.tech/api';

// API endpoints (прокси на Amvera)
app.get('/api/user_events', async (req, res) => {
    try {
        const response = await axios.get(`${AMVERA_API}/user_events`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/updates', async (req, res) => {
    try {
        const response = await axios.get(`${AMVERA_API}/updates`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/clan_info', async (req, res) => {
    try {
        const response = await axios.get(`${AMVERA_API}/clan_info`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/trials', async (req, res) => {
    try {
        const response = await axios.get(`${AMVERA_API}/trials`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const response = await axios.post(`${AMVERA_API}/feedback`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/register_streamer', async (req, res) => {
    try {
        const response = await axios.post(`${AMVERA_API}/register_streamer`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/send_manual_notification', async (req, res) => {
    try {
        const response = await axios.post(`${AMVERA_API}/send_manual_notification`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Раздача статических файлов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});
