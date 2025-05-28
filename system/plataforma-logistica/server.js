const app = require('./app');

const cors = require('cors');
app.use(cors());

//permitir apenas frontend?
// app.use(cors({
//   origin: 'http://localhost:5173' // ou a porta do teu React
// }));

const PORT = process.env.PORT || 3000;
//isto é usad0? esta bem?

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

