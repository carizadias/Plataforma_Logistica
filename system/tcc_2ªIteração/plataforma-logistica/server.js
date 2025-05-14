const app = require('./app');

const PORT = process.env.PORT || 3000;
//isto é usad0? esta bem?

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

