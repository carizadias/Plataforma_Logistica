
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());


app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/profile', require('./src/routes/profileRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/post_offices', require('./src/routes/postOfficeRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/admin_panel', require('./src/routes/adminPanelRoutes'));


module.exports = app;
