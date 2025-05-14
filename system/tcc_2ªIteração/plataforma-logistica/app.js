
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
//app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/post_offices', require('./src/routes/postOfficeRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/admin_panel', require('./src/routes/adminPanelRoutes'));

//🤔
//dividir rotas por utilizadores?
// /api/auth
// /api/client
// /api/system_admin
// /api/postal_company_admin
// /api/postal_company_employee

//dividir por entidades?
// /api/user
// /api/postal_companies(plural ou singular?)
// /api/post_offices
// /api/orders
// /api/payments

//categorias: como o /admin_panel e o /profile?
//...

//tenho doi lock json  e dois node modulesvou ter que apagar um deles depois(no fim)
module.exports = app;
