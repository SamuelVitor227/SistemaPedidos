const express = require('express');
const cors = require('cors');

const clientesRouter = require('./routes/clientes');
const produtosRouter = require('./routes/produtos');
const pedidosRouter = require('./routes/pedidos');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API Sistema de Pedidos' }));

app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);

module.exports = app;
