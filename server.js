const express = require('express');
const { createClient } = require('redis');
const os = require('os');

const app = express();
const port = 3000;

// Remplacez 'your_redis_ip' et 'your_redis_port' par l'adresse IP et le port de votre serveur Redis
const redisHost = 'db';
const redisPort = 6379; // Remplacez par le port de votre serveur Redis si différent

// Créer un client Redis avec l'adresse IP et le port spécifiés
const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => {
    console.error('Erreur Redis :', err);
});

redisClient.on('connect', () => {
    console.log('Connecté à Redis');
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
    } catch (error) {
        res.status(500).send('Erreur lors de l\'enregistrement de la date');
    }
});

app.get('/times', async (req, res) => {
    try {
        // Récupérer toutes les dates de Redis
        const times = await redisClient.lRange('times', 0, -1);
        res.send(times);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des dates');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
