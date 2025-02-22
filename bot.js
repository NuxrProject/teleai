require('dotenv').config();
const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Ambil API Key dari server
async function getApiKey() {
    try {
        const response = await axios.get(`${process.env.SERVER_URL}/apikey`);
        return response.data.apiKey;
    } catch (error) {
        console.error("Gagal mengambil API Key:", error);
        return null;
    }
}

bot.on('text', async (ctx) => {
    const apiKey = await getApiKey();
    if (!apiKey) return ctx.reply("API Key tidak ditemukan!");

    const openai = new OpenAIApi(new Configuration({ apiKey }));

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: ctx.message.text }]
        });

        ctx.reply(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error OpenAI:", error);
        ctx.reply("Terjadi kesalahan.");
    }
});

bot.launch();
console.log("Bot berjalan...");
