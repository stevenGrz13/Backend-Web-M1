const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('../utils/logger')
const mongoose = require('mongoose');
const cors = require('cors');
const errorMiddleware = require('../middleware/error-handler');

require('dotenv').config();

// const indexRouter = require('../routes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(errorMiddleware)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('garage/api/clients', require('../app/routes/client.routes'));
app.use('garage/api/managers', require('../app/routes/manager.routes'));
app.use('garage/api/users', require('../app/routes/user.routes'));
app.use('garage/api/mechanics', require('../app/routes/mechanic.routes'));
app.use('garage/api/vehicles', require('../app/routes/vehicle.routes'));
app.use('garage/api/rendezvous', require('../app/routes/rendezvous.routes'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info("database connected"))
    .catch(err => logger.error(err));

module.exports = app;
