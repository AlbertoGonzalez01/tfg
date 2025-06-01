const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Importamos el modelo de usuario
const bcrypt = require('bcryptjs'); //librería para encriptar y comparar contraseñas.
const jwt = require('jsonwebtoken'); //para crear tokens que permiten identificar a un usuario autenticado.


// Registro
router.post('/register', async (req, res) => {
  console.log('📥 Datos recibidos:', req.body);

  const {user, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ user }, { email }] }); //comprobamos si existe el usuario
    if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' }); //si existe devolvemos un error

    const hashedPassword = await bcrypt.hash(password, 10); //encriptamos la contraseña
    const newUser = new User({user, email, password: hashedPassword }); //creamos un nuevo usuario
    await newUser.save(); //guardamos el usuario en la base de datos

    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ msg: 'Error en el servidor:' + err.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const userId = await User.findOne({ user });
    if (!userId) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, userId.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ id: userId._id }, 'secreto', { expiresIn: '1h' });

    res.json({ msg: 'Inicio de sesión exitoso',
      token, 
      userId: userId._id }); // Devolvemos el token y el ID del usuario
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;