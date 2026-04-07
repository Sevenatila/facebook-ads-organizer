const express = require('express');
const router = express.Router();
const Custo = require('../models/Custo');

const CATEGORIAS_VALIDAS = ['codigo', 'info_card', 'ferramenta'];

// Listar custos com filtros
router.get('/', async (req, res) => {
    try {
        const filtros = {
            categoria: req.query.categoria || '',
            dataInicio: req.query.dataInicio || '',
            dataFim: req.query.dataFim || '',
            busca: req.query.q || ''
        };

        const custos = await Custo.buscarTodos(filtros);

        res.json({
            success: true,
            data: custos.map(c => ({
                id: c.id,
                categoria: c.categoria,
                descricao: c.descricao,
                valor: parseFloat(c.valor),
                data: c.data,
                observacao: c.observacao,
                createdAt: c.created_at
            })),
            total: custos.length
        });
    } catch (error) {
        console.error('Erro ao buscar custos:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Resumo por categoria
router.get('/resumo', async (req, res) => {
    try {
        const resumo = await Custo.resumoPorCategoria();
        res.json({ success: true, data: resumo });
    } catch (error) {
        console.error('Erro ao buscar resumo:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Criar custo
router.post('/', async (req, res) => {
    try {
        const { categoria, descricao, valor, data, observacao } = req.body;

        if (!categoria || !CATEGORIAS_VALIDAS.includes(categoria)) {
            return res.status(400).json({ success: false, message: 'Categoria inválida. Use: codigo, info_card ou ferramenta' });
        }
        if (!descricao || !descricao.trim()) {
            return res.status(400).json({ success: false, message: 'Descrição é obrigatória' });
        }
        if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
            return res.status(400).json({ success: false, message: 'Valor deve ser maior que zero' });
        }
        if (!data) {
            return res.status(400).json({ success: false, message: 'Data é obrigatória' });
        }

        const custo = await Custo.criar({ categoria, descricao: descricao.trim(), valor, data, observacao });

        res.status(201).json({
            success: true,
            message: 'Custo criado com sucesso',
            data: {
                id: custo.id,
                categoria: custo.categoria,
                descricao: custo.descricao,
                valor: parseFloat(custo.valor),
                data: custo.data,
                observacao: custo.observacao
            }
        });
    } catch (error) {
        console.error('Erro ao criar custo:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Atualizar custo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, descricao, valor, data, observacao } = req.body;

        if (!categoria || !CATEGORIAS_VALIDAS.includes(categoria)) {
            return res.status(400).json({ success: false, message: 'Categoria inválida' });
        }
        if (!descricao || !descricao.trim()) {
            return res.status(400).json({ success: false, message: 'Descrição é obrigatória' });
        }
        if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
            return res.status(400).json({ success: false, message: 'Valor deve ser maior que zero' });
        }
        if (!data) {
            return res.status(400).json({ success: false, message: 'Data é obrigatória' });
        }

        const atualizado = await Custo.atualizar(id, { categoria, descricao: descricao.trim(), valor, data, observacao });

        if (!atualizado) {
            return res.status(404).json({ success: false, message: 'Custo não encontrado' });
        }

        res.json({ success: true, message: 'Custo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar custo:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Deletar custo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Custo.deletar(id);

        if (!deletado) {
            return res.status(404).json({ success: false, message: 'Custo não encontrado' });
        }

        res.json({ success: true, message: 'Custo removido com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar custo:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

module.exports = router;
