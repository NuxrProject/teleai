const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Token bot Telegram
const token = '7792325812:AAEXurr11rDn8qevDiyz_-4RPhdBki7iQiE';

// API key OpenAI
const apiKey = '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';

// Buat instance bot Telegram
const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk mengirimkan pesan ke pengguna
const sendMessage = (chatId, text) => {
  bot.sendMessage(chatId, text);
};

// Fungsi untuk mengirimkan jawaban dari OpenAI
const sendAnswer = (chatId, question) => {
  axios.post(`https://api.openai.com/v1/chat/completions`, {
    model: 'gpt-3.5-turbo',
    prompt: question,
    max_tokens: 2048,
    temperature: 0.7,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    const answer = response.data.choices[0].text;
    sendMessage(chatId, answer);
  })
  .catch(error => {
    console.error(error);
    sendMessage(chatId, 'Maaf, saya tidak bisa menjawab pertanyaan Anda.');
  });
};

// Fungsi untuk menangani pesan dari pengguna
const handleMessage = (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/start')) {
    sendMessage(chatId, 'Selamat datang! Saya adalah bot AI yang dapat menjawab pertanyaan Anda.');
  } else {
    sendAnswer(chatId, text);
  }
};

// Fungsi untuk menangani pesan yang masuk
bot.on('message', handleMessage);

console.log('Bot Telegram auto AI telah siap!');
