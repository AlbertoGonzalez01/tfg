const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Obtener amigos
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'user _id');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener amigos' });
  }
});

// Agregar amigo
router.post('/add', async (req, res) => {
  const { userId, friendId } = req.body;
  const user = await User.findById(userId);

  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId);
    await user.save();
  }

  res.json({ msg: 'Amigo añadido' });
});

router.delete('/remove', async (req, res) => {
  const { userId, friendId } = req.body;

  await User.findByIdAndUpdate(userId, {
    $pull: { friends: friendId }
  });

  res.json({ msg: 'Amigo eliminado' });
});

router.get('/buscar-usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({}, '_id');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ msg: 'Error al buscar usuarios' });
  }
});

module.exports = router;