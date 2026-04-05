const express = require('express');
const router = express.Router();
const GoogleAds = require('../models/GoogleAds');

// Listar todas as campanhas Google Ads com filtros
router.get('/', async (req, res) => {
    try {
        const filtros = {
            busca: req.query.q || '',
            conta: req.query.conta || '',
            tipo: req.query.tipo || '',
            dataInicio: req.query.dataInicio || '',
            dataFim: req.query.dataFim || ''
        };

        const campanhas = await GoogleAds.buscarPorFiltros(filtros);

        // Converter formato para o frontend
        const campanhsFormatadas = campanhas.map(c => ({
            id: c.id,
            contaNome: c.conta_nome,
            contaId: c.conta_id,
            date: formatarDataBrasileira(c.data_pagamento),
            dk: c.data_key,
            valor: parseFloat(c.valor),
            tipoCampanha: c.tipo_campanha,
            plataforma: c.plataforma
        }));

        res.json({
            success: true,
            data: campanhsFormatadas,
            total: campanhsFormatadas.length
        });
    } catch (error) {
        console.error('Erro ao buscar campanhas Google Ads:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Buscar contas únicas
router.get('/contas', async (req, res) => {
    try {
        const contas = await GoogleAds.buscarContas();
        res.json({
            success: true,
            data: contas.map(c => ({
                id: c.conta_id || c.conta_nome,
                nome: c.conta_nome
            }))
        });
    } catch (error) {
        console.error('Erro ao buscar contas Google Ads:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar tipos de campanha únicos
router.get('/tipos', async (req, res) => {
    try {
        const tipos = await GoogleAds.buscarTiposCampanha();
        res.json({
            success: true,
            data: tipos.map(t => t.tipo_campanha)
        });
    } catch (error) {
        console.error('Erro ao buscar tipos de campanha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar contas por tipo
router.get('/contas/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const contas = await GoogleAds.buscarContasPorTipo(tipo);

        const contasFormatadas = contas.map(c => ({
            id: c.conta_id || c.conta_nome,
            nome: c.conta_nome,
            tipo: c.tipo_campanha
        }));

        res.json({
            success: true,
            data: contasFormatadas
        });
    } catch (error) {
        console.error('Erro ao buscar contas por tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar novas campanhas
router.post('/', async (req, res) => {
    try {
        const { campanhas } = req.body;

        if (!campanhas || !Array.isArray(campanhas) || campanhas.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de campanhas é obrigatória'
            });
        }

        // Validar cada campanha
        for (const campanha of campanhas) {
            if (!campanha.contaNome) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome da conta é obrigatório'
                });
            }
            if (!campanha.date || !campanha.valor) {
                return res.status(400).json({
                    success: false,
                    message: 'Data e valor são obrigatórios'
                });
            }
        }

        const result = await GoogleAds.criar(campanhas);

        res.status(201).json({
            success: true,
            message: `${campanhas.length} campanha(s) criada(s) com sucesso`,
            data: result
        });
    } catch (error) {
        console.error('Erro ao criar campanhas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Atualizar campanha
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        if (!dadosAtualizados.contaNome) {
            return res.status(400).json({
                success: false,
                message: 'Nome da conta é obrigatório'
            });
        }

        const result = await GoogleAds.atualizar(id, dadosAtualizados);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Campanha não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Campanha atualizada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar campanha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Deletar campanhas
router.delete('/', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de IDs é obrigatória'
            });
        }

        const result = await GoogleAds.deletar(ids);

        res.json({
            success: true,
            message: `${result.affectedRows} campanha(s) deletada(s) com sucesso`
        });
    } catch (error) {
        console.error('Erro ao deletar campanhas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Rota para dados consolidados (Meta + Google)
router.get('/consolidado', async (req, res) => {
    try {
        const filtros = {
            busca: req.query.q || '',
            dataInicio: req.query.dataInicio || '',
            dataFim: req.query.dataFim || ''
        };

        const dadosConsolidados = await GoogleAds.buscarDadosConsolidados(filtros);

        res.json({
            success: true,
            data: dadosConsolidados
        });
    } catch (error) {
        console.error('Erro ao buscar dados consolidados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
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