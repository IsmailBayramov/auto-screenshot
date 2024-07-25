// src/app/api/screenshot/route.js
import screenshot from 'screenshot-desktop';
import axios from 'axios';
import FormData from 'form-data';

// Замените на ваш Telegram Bot Token и chat_id
const TELEGRAM_BOT_TOKEN = '5976836873:AAFxjqCqpLcXUslTB786Sgyxf5JmDnMkwTw';
const CHAT_ID = '887442930';

async function sendScreenshotToTelegram(imageBuffer) {
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', imageBuffer, { filename: 'screenshot.png' });

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders(),
        });
    } catch (error) {
        console.error('Ошибка при отправке скриншота в Telegram:', error);
        throw error;
    }
}

export async function GET(request) {
    try {
        // Снимок экрана
        const img = await screenshot();

        // Отправка скриншота в Telegram
        await sendScreenshotToTelegram(img);

        return new Response('Скриншот успешно отправлен в Telegram', {
            status: 200,
        });
    } catch (err) {
        console.error('Ошибка при создании или отправке скриншота:', err);
        return new Response('Не удалось создать или отправить скриншот', {
            status: 500,
        });
    }
}
