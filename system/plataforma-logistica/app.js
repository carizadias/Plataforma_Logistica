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

const API = '/api/v1';

//currencies fica em payments(por causa de ligação com payments) ou locations(por causa de ligaação com countries)? em payments
//files não precisa de controlador, certo?
//tipos de utilizador são definidos direto no sistema e não por admin, certo?
/*'user_role'
'user_type_permission'
'user_types'
'users'*/

//não criar rotas para paineis apenas entidades(terão paineis em fend)
app.use(`${API}/auth`, require('./src/routes/authRoutes'));//autenticação de todos os utilizadores
app.use(`${API}/profile`, require('./src/routes/profileRoutes'));////client, admin, postal company admin, employee,(perfis apenas de utilizadores), CRUD de addresses e phone numbers
app.use(`${API}/users`, require('./src/routes/userRoutes'));//CRUD de endereços de cliente

app.use(`${API}/postal-companies`, require('./src/routes/postalCompanyRoutes'));//postal company profile, CRUD phone numbers
app.use(`${API}/post-offices`, require('./src/routes/postOfficeRoutes'));//post office profile inclu, hours, CRUD de addresses e phone numbers

app.use(`${API}/services`, require('./src/routes/serviceRoutes'));//CRUD,
app.use(`${API}/sub-services`, require('./src/routes/subServiceRoutes'));//CRUD, channels
app.use(`${API}/special-services`, require('./src/routes/specialServiceRoutes'));//CRUD
app.use(`${API}/sub-special-services`, require('./src/routes/subSpecialServiceRoutes'));//CRUD

app.use(`${API}/orders`, require('./src/routes/orderRoutes'));//evaluation, recipient, status, types
app.use(`${API}/payments`, require('./src/routes/paymentRoutes'));//methods, status, currencies
//app.use(`${API}/deliveries`, require('./src/routes/deliveryRoutes'));//para escalabilidade parece bom que tenha próprio controlador

app.use(`${API}/fees`, require('./src/routes/feeRoutes'));//CRUD de tarifaz

//Para produção:
//app.use(`${API}/coverages`, require('./src/routes/coverageRoutes'));//areas, types
//app.use(`${API}/channels`, require('./src/routes/channelRoutes'));//acceptance and distribution
//app.use(`${API}/locations`, require('./src/routes/locationRoutes'));//continents, countries(country-types), cities, neighborhoods('zip_codes'), addresses,
//app.use(`${API}/permissions`, require('./src/routes/permissionRoutes'));//CRUD de permissões, faz parte de painel de administrador?


module.exports = app;
