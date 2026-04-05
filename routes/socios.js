const express = require('express');
const router = express.Router();
const Socio = require('../models/Socio');

// Listar todos os sócios
router.get('/', async (req, res) => {
    try {
        const socios = await Socio.buscarTodos();

        const sociosFormatados = socios.map(s => ({
            id: s.id,
            nome: s.nome,
            email: s.email,
            percentual: parseFloat(s.percentual),
            ativo: Boolean(s.ativo),
            dataEntrada: s.data_entrada,
            observacoes: s.observacoes,
            createdAt: s.created_at,
            updatedAt: s.updated_at
        }));

        res.json({
            success: true,
            data: sociosFormatados
        });
    } catch (error) {
        console.error('Erro ao buscar sócios:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Listar apenas sócios ativos
router.get('/ativos', async (req, res) => {
    try {
        const sociosAtivos = await Socio.buscarAtivos();

        const sociosFormatados = sociosAtivos.map(s => ({
            id: s.id,
            nome: s.nome,
            email: s.email,
            percentual: parseFloat(s.percentual),
            dataEntrada: s.data_entrada
        }));

        res.json({
            success: true,
            data: sociosFormatados
        });
    } catch (error) {
        console.error('Erro ao buscar sócios ativos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Buscar sócio por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const socio = await Socio.buscarPorId(id);

        if (!socio) {
            return res.status(404).json({
                success: false,
                message: 'Sócio não encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                id: socio.id,
                nome: socio.nome,
                email: socio.email,
                percentual: parseFloat(socio.percentual),
                ativo: Boolean(socio.ativo),
                dataEntrada: socio.data_entrada,
                observacoes: socio.observacoes
            }
        });
    } catch (error) {
        console.error('Erro ao buscar sócio:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar novo sócio
router.post('/', async (req, res) => {
    try {
        const { nome, email, percentual, ativo, dataEntrada, observacoes } = req.body;

        if (!nome) {
            return res.status(400).json({
                success: false,
                message: 'Nome do sócio é obrigatório'
            });
        }

        if (!percentual || percentual <= 0 || percentual > 100) {
            return res.status(400).json({
                success: false,
                message: 'Percentual deve ser entre 0.01 e 100'
            });
        }

        const dadosSocio = {
            nome,
            email,
            percentual: parseFloat(percentual),
            ativo: ativo !== false,
            dataEntrada,
            observacoes
        };

        const novoSocio = await Socio.criar(dadosSocio);

        res.status(201).json({
            success: true,
            message: 'Sócio criado com sucesso',
            data: {
                id: novoSocio.id,
                nome: novoSocio.nome,
                email: novoSocio.email,
                percentual: parseFloat(novoSocio.percentual),
                ativo: Boolean(novoSocio.ativo)
            }
        });
    } catch (error) {
        console.error('Erro ao criar sócio:', error);

        if (error.message.includes('Percentual excede') || error.message.includes('Email já cadastrado')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Atualizar sócio
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, percentual, ativo, dataEntrada, observacoes } = req.body;

        const dadosAtualizados = {};

        if (nome !== undefined) dadosAtualizados.nome = nome;
        if (email !== undefined) dadosAtualizados.email = email;
        if (percentual !== undefined) {
            if (percentual <= 0 || percentual > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Percentual deve ser entre 0.01 e 100'
                });
            }
            dadosAtualizados.percentual = parseFloat(percentual);
        }
        if (ativo !== undefined) dadosAtualizados.ativo = ativo;
        if (dataEntrada !== undefined) dadosAtualizados.dataEntrada = dataEntrada;
        if (observacoes !== undefined) dadosAtualizados.observacoes = observacoes;

        const socioAtualizado = await Socio.atualizar(id, dadosAtualizados);

        res.json({
            success: true,
            message: 'Sócio atualizado com sucesso',
            data: {
                id: socioAtualizado.id,
                nome: socioAtualizado.nome,
                email: socioAtualizado.email,
                percentual: parseFloat(socioAtualizado.percentual),
                ativo: Boolean(socioAtualizado.ativo)
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar sócio:', error);

        if (error.message.includes('não encontrado') || error.message.includes('Percentual excede')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Deletar sócio
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sucesso = await Socio.deletar(id);

        if (!sucesso) {
            return res.status(404).json({
                success: false,
                message: 'Sócio não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Sócio removido com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar sócio:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Ativar/desativar sócio
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body;

        if (ativo === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Status ativo é obrigatório'
            });
        }

        const sucesso = await Socio.ativarDesativar(id, ativo);

        if (!sucesso) {
            return res.status(404).json({
                success: false,
                message: 'Sócio não encontrado'
            });
        }

        res.json({
            success: true,
            message: `Sócio ${ativo ? 'ativado' : 'desativado'} com sucesso`
        });
    } catch (error) {
        console.error('Erro ao alterar status do sócio:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Calcular distribuição de valores
router.post('/distribuicao', async (req, res) => {
    try {
        const { valorTotal } = req.body;

        if (!valorTotal || valorTotal <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valor total deve ser maior que zero'
            });
        }

        const distribuicao = await Socio.calcularDistribuicao(parseFloat(valorTotal));

        res.json({
            success: true,
            data: distribuicao
        });
    } catch (error) {
        console.error('Erro ao calcular distribuição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Obter resumo/relatório dos sócios
router.get('/relatorio/resumo', async (req, res) => {
    try {
        const relatorio = await Socio.gerarRelatorio();

        res.json({
            success: true,
            data: relatorio
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Obter percentual total atual
router.get('/percentual/total', async (req, res) => {
    try {
        const percentualTotal = await Socio.calcularPercentualTotal();

        res.json({
            success: true,
            data: {
                percentualDistribuido: percentualTotal,
                percentualDisponivel: 100 - percentualTotal
            }
        });
    } catch (error) {
        console.error('Erro ao calcular percentual total:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;