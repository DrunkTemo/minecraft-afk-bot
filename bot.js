const mineflayer = require('mineflayer');
const express = require('express');
const config = require('./settings.json');
const loggers = require('./logging.js');
const logger = loggers.logger;

// uptime checker (you could use https://uptimerobot.com)
const app = express();
app.get('/', (req, res) => {
  const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.send('Your Bot Is Ready! Subscribe My Youtube: <a href="https://youtube.com/@H2N_OFFICIAL?si=UOLwjqUv-C1mWkn4">H2N OFFICIAL</a><br>Link Web For Uptime: <a href="' + currentUrl + '">' + currentUrl + '</a>');
});
app.listen(3000, () => {
  logger.info("Uptime monitor server listening on port 3000");
});

function createBot() {
    const bot = mineflayer.createBot({
        username: config['bot-account']['username'],
        password: config['bot-account']['password'],
        auth: config['bot-account']['type'],
        host: config.server.ip,
        port: config.server.port,
        version: config.server.version,
    });

    bot.once('spawn', () => {
        logger.info("Bot joined to the server");

        // 500 ms shifting
        setInterval(() => {
            if (!bot.controlState.sneak) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 500);
            }
        }, 5000);

        // 300 ms jyump
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 300);
        }, 3000);

        // swing every 2 secondws
        setInterval(() => {
            bot.swingArm('right');
        }, 2000);
    });

    bot.on('kicked', (reason) => {
        logger.warn(`Bot was kicked: ${reason}`);
    });

    bot.on('error', (err) => {
        logger.error(`Error: ${err.message}`);
    });

    bot.on('end', () => {
        logger.warn("Bot disconnected. Reconnecting in 5 seconds...");
        setTimeout(createBot, 5000); 
		// you can set yourrr yown time here (1000 - is one second)
    });
}

createBot();