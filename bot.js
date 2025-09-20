const TelegramBot = require('node-telegram-bot-api');

// Get bot token from environment variable
const BOT_TOKEN = process.env.BOT_TOKEN;

// Your specific chat ID to monitor
const TARGET_CHAT_ID = -1003019078755;

// Array of photo file_ids to randomly choose from when "кис" is detected
const RESPONSE_PHOTOS = [
    'AgACAgQAAyEFAASz83xjAAIDPmjOlE1Uj1Y2OUSO_qjAJX9Hx7oNAAKYxjEb3q15UqBeH2qvNyE_AQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDP2jOlE0H78nrqtIoz3FuuoG3Eg2nAAKTxjEb3q15UubF4ywk8bTiAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDQGjOlE0T41V047YVFhOJetLEzeifAAKUxjEb3q15UjDkl8ic6RlSAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDQWjOlE3pTjRG2DHKTU3jscB7w0vtAAKVxjEb3q15UvLdOEsIOTmQAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDQmjOlE2ZuZTvaPmawKdtaPhewDgkAAKWxjEb3q15Uh-xaJaALWVTAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDQ2jOlE04g6uYyxBsxnLiAqj3aejkAAKaxjEb3q15UsZn23rutv7RAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDRGjOlE0aKcuahZES9rYyJkUIBJhOAAKcxjEb3q15Up92t-ny_kjhAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDRWjOlE1Mv6GcmspSDlhmdr3B2-uGAAKexjEb3q15UsajK5eBw2yNAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDRmjOlE3lXu6Qna4lJi_QS5neUTzBAAKgxjEb3q15UjuHePh7AuwWAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDR2jOlE2wk97cznBX-5N7y-IhkKPBAAKixjEb3q15Uh4KwBa96jReAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDSGjOlFQ2eXyzLO-i-FUJc5NeD4LFAAKjxjEb3q15UiW3P2nIgZCcAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDSWjOlFSULNix9A7V5-dku_p56baTAAKlxjEb3q15UiMRBH0rIZ4rAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDSmjOlFTNGTzj8NqWBMQhYOOWa7HNAAKXxjEb3q15Us2ScLPljuALAQADAgADeAADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDS2jOlFRhnba6eI7vvqYSg3QX0UZ-AAKnxjEb3q15UkKvtL-rJsf4AQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDTGjOlFRCLPZakgtU-DclscTBxaMQAAKpxjEb3q15UkLQX1L4mV6IAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDT2jOlFThcOCh-KKaNyDTGixfShvFAAKdxjEb3q15UnAorsyfFD0AAQEAAwIAA3kAAzYE',
    'AgACAgQAAyEFAASz83xjAAIDTWjOlFTMAXuwrH9V5YNh1MLqrYvHAAKZxjEb3q15UnBeClaKizmZAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDUWjOlFTE-aFhKavw0KVOChWo6v0AA6HGMRverXlSW7c0FPcUB28BAAMCAAN5AAM2BA',
    'AgACAgQAAyEFAASz83xjAAIDUGjOlFTGuSX4Vv4ZyMRi5d6JAtynAAKfxjEb3q15UnjTR9XEfQpHAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDTmjOlFQO0J3YVA9wUJcMzpYQ0S3CAAKbxjEb3q15UlUzHxrZVHCJAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAICymjNdgZf3b-rasUHqYtnbeiD-gQqAAJiyTEbICBxUlykupzPNWnLAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDU2jOlFw_8QsfUfmn30xL87Q1DOD7AAKsxjEb3q15UrlvozU_N3MXAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDVGjOlFye_QwZljFjKVbRPTH8XZybAAKwxjEb3q15Ug0lwXVqgsbxAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDVWjOlGAEl2JhUa23_Ig-hupIK82zAAKkxjEb3q15Uj4QMCJ-mqqPAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDVmjOlGAituC2E1BvFV0p1r03W3BXAAKqxjEb3q15UkEOzayAVhjUAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDWGjOlGAwQXGPZCGy9pP2rKE0-Fl4AAKrxjEb3q15UumAvezqM5rvAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDWWjOlGD70H8T2VG1GyhYXoWpAAHZwAACrcYxG96teVL3zNR-1H4xlAEAAwIAA3kAAzYE',
    'AgACAgQAAyEFAASz83xjAAIDWmjOlGBPX4Ag56bbzRsmpJmhENOyAAKuxjEb3q15UtvwroqytnVCAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDW2jOlGDVj2p8gSjMg7WZHmSc_vh8AAKvxjEb3q15UrHML0ZPCLGGAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDXGjOlGB1W2pzpD08NDebpL99d92YAAKxxjEb3q15UgOpPTFO66U_AQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDXWjOlGBqoru6wE8Dt-TcxR1WQX0RAAKyxjEb3q15Um8Qb5FYKJXsAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIDXmjOlGCkawWIcD7GoNBHbeWZg176AAKoxjEb3q15Umo024eqGhoJAQADAgADeQADNgQ',
    'AgACAgQAAyEFAASz83xjAAIC02jNdk1H7FHy7b3QYOpSRGXMuFTDAAJkyTEbICBxUjb2HGzEHkOBAQADAgADeQADNgQ'
];

// Your sticker mapping
const stickerMap = {
    // Trigger sticker -> Response sticker
    'CAACAgQAAyEFAASz83xjAAMTaMg8ue6oj_jhkyqVY-YyrkNkGYQAAhELAAL0ShFT0Oc-g4iD3yw2BA': 'CAACAgQAAyEFAASz83xjAAMYaMg9FGUur-PnhKWn2H-IVjSIUb4AAsAJAALcTtBSg-GVd_pMn7g2BA'
};

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('Bot is starting...');

// Handle all messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    // Only process messages from the target chat
    if (chatId !== TARGET_CHAT_ID) {
        return;
    }
    
    // Check if message contains a photo
    if (msg.photo) {
        console.log('\n=== PHOTO RECEIVED ===');
        console.log(`From user: ${msg.from.first_name} (@${msg.from.username || 'no_username'})`);
        console.log(`Photo sizes available:`);
        
        msg.photo.forEach((photo, index) => {
            console.log(`  Size ${index}: ${photo.width}x${photo.height} - ID: ${photo.file_id}`);
        });
        
        // Get the largest photo (last in array)
        const largestPhoto = msg.photo[msg.photo.length - 1];
        console.log(`\n📷 LARGEST PHOTO ID: ${largestPhoto.file_id}`);
        console.log('====================\n');
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
            console.log('Text containing "кис" detected! Sending random photo response...');
            
            // Randomly select a photo from the array
            const randomPhoto = RESPONSE_PHOTOS[Math.floor(Math.random() * RESPONSE_PHOTOS.length)];
            console.log(`Selected photo: ${randomPhoto}`);
            
            // Send random photo as a reply
            bot.sendPhoto(chatId, randomPhoto, {
                reply_to_message_id: messageId,
                //caption: '🐱' // Optional caption
            }).then(() => {
                console.log('Random response photo sent successfully!');
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
