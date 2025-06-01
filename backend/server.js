const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//conectamos con la base de datos de mongodb

//mongoose.connect('mongodb+srv://agdiez01:kksDBmIfgZFFR277@aplicaciontfg.rftumey.mongodb.net/usuarios?retryWrites=true&w=majority&appName=aplicacionTFG')
mongoose.connect('mongodb+srv://AlbertoTFG:7Ji6hsp.V#3ukT%@aplicaciontfg.rftumey.mongodb.net/?retryWrites=true&w=majority&appName=aplicacionTFG')
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error de conexión:', err));

app.use('/api/auth', require('./routes/Auth'));

app.use('/api/photos', require('./routes/photos'));
app.use('/api/friends', require('./routes/friends'));

//escuchamos el puerto 5000
//para que el servidor escuche las peticiones
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));