const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const User = require('../models/user');



// Subir foto
router.post('/upload', async (req, res) => {
  const { userId, imageUrl, caption } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ msg: 'Faltan datos obligatorios' });
  }

  try {
    const newPhoto = new Photo({ userId, imageUrl, caption });
    await newPhoto.save();
    res.status(201).json({ msg: 'Foto subida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al subir foto' });
  }
});

// Obtener fotos de un usuario
router.get('/feed/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends');

    const ids = [user._id, ...user.friends.map(f => f._id)];

    const photos = await Photo.find({ userId: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate('userId', 'user');

    res.json(photos);
  } catch (err) {
    console.error('Error al obtener feed:', err);
    res.status(500).json({ msg: 'Error al obtener el feed' });
  }
});

module.exports = router;