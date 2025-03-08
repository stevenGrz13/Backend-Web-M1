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
app.use('garage/api/clients', require('../app/components/client/client.routes'));
app.use('garage/api/managers', require('../app/components/manager/manager.routes'));
app.use('garage/api/users', require('../app/components/user/user.routes'));


mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info("database connected"))
    .catch(err => logger.error(err));

module.exports = app;
