const express = require('express');
const { createClient } = require('redis');
const os = require('os');
const winston = require('winston'), //logger
    expressWinston = require('express-winston')

const app = express();
const port = 3000;

const logger = winston.createLogger({ // creation logger
    transports: [
        new winston.transports.File({ filename: '/app/logs/app.log' }),
        new winston.transports.Console()
    ]
});

app.use(expressWinston.logger({ // creation logger winston
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '/app/logs/requests.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
}));

// Remplacez 'your_redis_ip' et 'your_redis_port' par l'adresse IP et le port de votre serveur Redis
const redisHost = 'db';
const redisPort = 6379; // Remplacez par le port de votre serveur Redis si différent

// Créer un client Redis avec l'adresse IP et le port spécifiés
const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => {
    console.error('Erreur Redis :', err);
    logger.info('Erreur Redis :', err);
});

redisClient.on('connect', () => {
    console.log('Connecté à Redis');
    logger.info('Connecté à Redis');
});

// Connexion au client Redis
redisClient.connect().catch(console.error);

app.get('/', async (req, res) => {
    res.send(`Y'a rien a voir ici !!!!`);
});

app.get('/time', async (req, res) => {
    const currentTime = new Date().toISOString();
    const osType = os.hostname();
    try {
        // Enregistrer la date dans Redis
        await redisClient.lPush('times', `${currentTime} - ${osType}`);
        res.send(`The current time is ${currentTime} and the OS is ${osType}`);
        logger.info(`The current time is ${currentTime} and the OS is ${osType}`);
    } catch (error) {
        res.status(500).send('Erreur lors de l\'enregistrement de la date');
        logger.info(`Erreur /time`);
    }
});

app.get('/times', async (req, res) => {
    try {
        // Récupérer toutes les dates de Redis
        const times = await redisClient.lRange('times', 0, -1);
        res.send(times);
        logger.info(times);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des dates');
        logger.info(`Erreur /times`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
