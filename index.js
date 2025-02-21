const TelegramBot = require('node-telegram-bot-api');
const openai = require('openai');

// Token API bot
const token = '7792325812:AAEXurr11rDn8qevDiyz_-4RPhdBki7iQiE';

// Token API ChatGPT
const openaiApiKey = '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';

// Buat bot Telegram
const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk menghandle pesan masuk
if (bot) {
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Apa PertanyaaanMu Tuan.");
    });
    
bot.on('message', (msg) => {
  // Dapatkan pesan masuk
  const message = msg.text;

  // Gunakan API ChatGPT untuk menjawab pertanyaan pengguna
  openai.Completion.create({
    engine: 'text-davinci-003',
    prompt: message,
    maxTokens: 2048,
    temperature: 0.5
  }, {
    apiKey: openaiApiKey
  })
  .then((response) => {
    // Kirim jawaban kembali ke pengguna
    bot.sendMessage(msg.chat.id, response.choices[0].text);
  })
  .catch((error) => {
    console.error(error);
  });
});
