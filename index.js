const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '6317082074:AAEhrT3RVBSjn8jGgQVqcEBJJytaKfXWGmo'

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Numbers game')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Lets go', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start bot'},
        {command: '/info', description: 'Your information'},
        {command: '/game', description: 'Game'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/25e/7c6/25e7c651-cd86-4dc0-923e-e50b9aa7004c/96/14.webp")
            return bot.sendMessage(chatId, `Welcome to bot`) 
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`) 
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'What do you wont')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        if (+(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `You win, number is ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `You lose, number is ${chats[chatId]}`, againOptions)
        }
    })
}

start()