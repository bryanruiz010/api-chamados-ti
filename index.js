const express = require('express');
const app = express();
app.use(express.json());

const chamados = [];
let proximoId = 1;

app.get('/', (req, res) => {
    res.send('olá! A API de chamados está funcionando.');
});

app.post('/chamados', (req, res) => {
    const { titulo, descricao, solicitante, prioridade } = req.body;
    const prioridadesValidas = ['Baixa', 'Media', 'Alta'];

    if (!titulo || !descricao || !solicitante) {
        return res.status(400).json({ erro: 'Titulo, descricao e solicitante são obrigatórios' });
    }

    if (!prioridadesValidas.includes(prioridade)) {
        return res.status(400).json({ erro: 'Prioridade deve ser Baixa, Media ou Alta' });
    }

    const chamado = {
        id: proximoId++,
        titulo,
        descricao,
        solicitante,
        prioridade,
        status: 'Aberto',
    };
    chamados.push(chamado);
    res.status(201).json(chamado);
});

app.get('/chamados', (req, res) => {
    const { status, prioridade } = req.query;
    let resultado = chamados;

    if (status) {
        resultado = resultado.filter((c) => c.status === status);
    }

    if (prioridade) {
        resultado = resultado.filter((c) => c.prioridade === prioridade);
    }

    res.json(resultado);
})

app.patch('/chamados/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const chamado = chamados.find((c) => c.id === id);
    const statusValidos = ['Aberto', 'Em atendimento', 'Resolvido'];

    if (!chamado) {
        return res.status(404).json({ erro: 'Chamado não encontrado' });
    }

    if (!statusValidos.includes (req.body.status)) {
        return res.status(400).json({ erro: 'Status deve ser Aberto, Em atendimento ou Resolvido' });
    }

    chamado.status = req.body.status;
    res.json(chamado);
});

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});