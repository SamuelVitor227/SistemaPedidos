const express = require('express');
const { db, admin } = require('../config/firebase');

const router = express.Router();
const COLLECTION = 'pedidos';
const STATUS_VALIDOS = ['Pendente', 'Pago', 'Enviado', 'Cancelado'];

// GET /pedidos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('criadoEm', 'desc').get();
    const pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pedidos/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pedidos/cliente/:clienteId
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION)
      .where('clienteId', '==', req.params.clienteId)
      .orderBy('criadoEm', 'desc')
      .get();
    const pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /pedidos
router.post('/', async (req, res) => {
  try {
    const { clienteId, clienteNome, itens } = req.body;
    if (!clienteId || !clienteNome || !itens?.length)
      return res.status(400).json({ error: 'clienteId, clienteNome e itens são obrigatórios' });

    const total = itens.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);
    const agora = new Date();

    const data = {
      clienteId,
      clienteNome,
      itens,
      status: 'Pendente',
      total,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    const docRef = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /pedidos/:id (atualiza itens e total)
router.put('/:id', async (req, res) => {
  try {
    const ref = db.collection(COLLECTION).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Pedido não encontrado' });

    const { itens } = req.body;
    if (!itens?.length) return res.status(400).json({ error: 'Itens são obrigatórios' });

    const total = itens.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);
    await ref.update({ itens, total, atualizadoEm: new Date() });
    res.json({ id: req.params.id, ...doc.data(), itens, total, atualizadoEm: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /pedidos/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS_VALIDOS.includes(status))
      return res.status(400).json({ error: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });

    const ref = db.collection(COLLECTION).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Pedido não encontrado' });

    await ref.update({ status, atualizadoEm: new Date() });
    res.json({ id: req.params.id, ...doc.data(), status, atualizadoEm: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /pedidos/:id
router.delete('/:id', async (req, res) => {
  try {
    const ref = db.collection(COLLECTION).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Pedido não encontrado' });

    await ref.delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
