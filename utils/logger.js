const { createLogger, transports, format } = require('winston');

// 📌 Définition du format du log
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Ajoute un timestamp
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// 📌 Création du logger
const logger = createLogger({
    level: 'info', // Niveau minimal à logguer ('info', 'warn', 'error', etc.)
    format: logFormat,
    transports: [
        new transports.Console(), // Afficher dans la console
    ]
});

module.exports = logger;
