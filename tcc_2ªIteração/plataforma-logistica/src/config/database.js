const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Conectado ao banco de dados'))
    .catch(err => console.log('Erro ao conecttar ao banco:', err));

module.exports = sequelize;