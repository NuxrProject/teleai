require('dotenv').config();
const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
let openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simpan API key sementara dalam memori
let apiKeys = {};

// Fungsi untuk mengatur API key baru
bot.command('setkey', (ctx) => {
    const key = ctx.message.text.split(' ')[1];
    if (!key) {
        return ctx.reply('Gunakan format: /setkey YOUR_OPENAI_API_KEY');
    }
    apiKeys[ctx.chat.id] = key;
    ctx.reply('✅ API Key berhasil diperbarui!');
});

// Fungsi untuk merespons pesan menggunakan OpenAI
bot.on('text', async (ctx) => {
    const userKey = apiKeys[ctx.chat.id] || process.env.OPENAI_API_KEY;
    const ai = new OpenAI({ apiKey: userKey });

    try {
        const response = await ai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: ctx.message.text }]
        });

        ctx.reply(response.choices[0].message.content);
    } catch (error) {
        ctx.reply('❌ Terjadi kesalahan: ' + error.message);
    }
});

// Menjalankan bot
bot.launch();
console.log('🤖 Bot telah berjalan...');
