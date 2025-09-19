const TelegramBot = require('node-telegram-bot-api');

// Get bot token from environment variable
const BOT_TOKEN = process.env.BOT_TOKEN;

// Your specific chat ID to monitor
const TARGET_CHAT_ID = -1003019078755;

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Your sticker mapping
const stickerMap = {
    // Trigger sticker -> Response sticker
    'CAACAgQAAxkBAAE7JUBoyBQM-l6Ii4L78U1ODXOcuX6t_QACEQsAAvRKEVPQ5z6DiIPfLDYE': 'CAACAgQAAxkBAAE7JzloyDpdU9u1ioEkQDSfdRyDVAMokgACwAkAAtxO0FKD4ZV3-kyfuDYE'
};

console.log('Bot is starting...');

// The photo/image you want to send (you can use file_id, URL, or file path)
const RESPONSE_PHOTO = 'https://i.imgur.com/your-image.jpg'; // Replace with your image URL or file_id

// Handle all messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    // Only process messages from the target chat
    if (chatId !== TARGET_CHAT_ID) {
        return;
    }
    
    // Check if message contains a sticker
    if (msg.sticker) {
        const stickerFileId = msg.sticker.file_id;
        console.log(`Received sticker in target chat: ${stickerFileId}`);
        
        // Check if this sticker should trigger a response
        if (stickerMap[stickerFileId]) {
            const responseSticker = stickerMap[stickerFileId];
            
            console.log('Trigger sticker detected! Sending response...');
            
            // Send response sticker as a reply
            bot.sendSticker(chatId, responseSticker, {
                reply_to_message_id: messageId
            }).then(() => {
                console.log('Response sticker sent successfully!');
            }).catch(error => {
                console.error('Error sending sticker:', error);
            });
        }
    }
    
    // Check if message contains text with "кис" substring
    if (msg.text) {
        const messageText = msg.text.toLowerCase();
        console.log(`Received text message: ${msg.text}`);
        
        // Check if text contains "кис" (case insensitive)
        if (messageText.includes('кис')) {
            console.log('Text containing "кис" detected! Sending photo response...');
            
            // Send photo as a reply
            bot.sendPhoto(chatId, RESPONSE_PHOTO, {
                reply_to_message_id: messageId,
                caption: '🐱' // Optional caption
            }).then(() => {
                console.log('Response photo sent successfully!');
            }).catch(error => {
                console.error('Error sending photo:', error);
            });
        }
    }
});

// Handle polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Log when bot starts successfully
bot.getMe().then(botInfo => {
    console.log(`Bot @${botInfo.username} is running!`);
    console.log(`Monitoring chat ID: ${TARGET_CHAT_ID}`);
    console.log('Waiting for trigger stickers...');
}).catch(error => {
    console.error('Error starting bot:', error);
    process.exit(1);
});

// Keep the process alive
process.on('SIGINT', () => {
    console.log('Stopping bot...');
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Stopping bot...');
    bot.stopPolling();
    process.exit(0);
});
