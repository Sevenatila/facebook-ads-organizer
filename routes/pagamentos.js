const express = require('express');
const router = express.Router();
const Pagamento = require('../models/Pagamento');

// Listar todos os pagamentos com filtros
router.get('/', async (req, res) => {
    try {
        const filtros = {
            busca: req.query.q || '',
            bm: req.query.bm || '',
            conta: req.query.conta || '',
            dataInicio: req.query.dataInicio || '',
            dataFim: req.query.dataFim || ''
        };

        const pagamentos = await Pagamento.buscarPorFiltros(filtros);

        // Converter formato para o frontend
        const pagamentosFormatados = pagamentos.map(p => ({
            id: p.id,
            bm: p.bm,
            contaNome: p.conta_nome,
            contaId: p.conta_id,
            date: formatarDataBrasileira(p.data_pagamento),
            dk: p.data_key,
            valor: parseFloat(p.valor)
        }));

        res.json({
            success: true,
            data: pagamentosFormatados,
            total: pagamentosFormatados.length
        });
    } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Buscar BMs únicas
router.get('/bms', async (req, res) => {
    try {
        const bms = await Pagamento.buscarBMs();
        res.json({
            success: true,
            data: bms.map(b => b.bm)
        });
    } catch (error) {
        console.error('Erro ao buscar BMs:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar contas por BM
router.get('/contas', async (req, res) => {
    try {
        const { bm } = req.query;
        const contas = await Pagamento.buscarContasPorBM(bm);

        const contasFormatadas = contas.map(c => ({
            id: c.conta_id || c.conta_nome,
            nome: c.conta_nome
        }));

        res.json({
            success: true,
            data: contasFormatadas
        });
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar novos pagamentos
router.post('/', async (req, res) => {
    try {
        const { pagamentos } = req.body;

        if (!pagamentos || !Array.isArray(pagamentos) || pagamentos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de pagamentos é obrigatória'
            });
        }

        // Validar cada pagamento
        for (const pag of pagamentos) {
            if (!pag.contaNome && !pag.bm) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome da conta ou BM é obrigatório'
                });
            }
            if (!pag.date || !pag.valor) {
                return res.status(400).json({
                    success: false,
                    message: 'Data e valor são obrigatórios'
                });
            }
        }

        const result = await Pagamento.criar(pagamentos);

        res.status(201).json({
            success: true,
            message: `${pagamentos.length} pagamento(s) criado(s) com sucesso`,
            data: result
        });
    } catch (error) {
        console.error('Erro ao criar pagamentos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Atualizar pagamento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        if (!dadosAtualizados.contaNome && !dadosAtualizados.bm) {
            return res.status(400).json({
                success: false,
                message: 'Nome da conta ou BM é obrigatório'
            });
        }

        const result = await Pagamento.atualizar(id, dadosAtualizados);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pagamento não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Pagamento atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar pagamento:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Deletar pagamentos
router.delete('/', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de IDs é obrigatória'
            });
        }

        const result = await Pagamento.deletar(ids);

        res.json({
            success: true,
            message: `${result.affectedRows} pagamento(s) deletado(s) com sucesso`
        });
    } catch (error) {
        console.error('Erro ao deletar pagamentos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Função auxiliar para formatar data brasileira
function formatarDataBrasileira(data) {
    if (!data) return '';

    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();

    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    return `${parseInt(dia)} de ${meses[d.getMonth()]} de ${ano}`;
}

module.exports = router;