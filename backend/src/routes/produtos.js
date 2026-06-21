const express = require('express');
const { db } = require('../config/firebase');

const router = express.Router();
const COLLECTION = 'produtos';

// GET /produtos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('nome').get();
    const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /produtos/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /produtos
router.post('/', async (req, res) => {
  try {
    const { nome, preco, estoque, descricao, imagem } = req.body;
    if (!nome || preco == null || estoque == null)
      return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });

    const data = { nome, preco: Number(preco), estoque: Number(estoque), descricao: descricao || null, imagem: imagem || null };
    const docRef = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /produtos/:id
router.put('/:id', async (req, res) => {
  try {
    const ref = db.collection(COLLECTION).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Produto não encontrado' });

    const { nome, preco, estoque, descricao, imagem } = req.body;
    if (!nome || preco == null || estoque == null)
      return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });

    const data = { nome, preco: Number(preco), estoque: Number(estoque), descricao: descricao || null, imagem: imagem || null };
    await ref.set(data);
    res.json({ id: req.params.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /produtos/:id
router.delete('/:id', async (req, res) => {
  try {
    const ref = db.collection(COLLECTION).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Produto não encontrado' });

    await ref.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
