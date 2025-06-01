const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

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

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const photos = await Photo.find({ userId }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error('Error al obtener fotos:', err);
    res.status(500).json({ msg: 'Error al cargar fotos' });
  }
});

module.exports = router;