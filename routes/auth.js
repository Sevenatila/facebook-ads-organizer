const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Login com email
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Email válido é obrigatório'
            });
        }

        // Buscar ou criar usuário
        let usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            usuario = await Usuario.criar(email);
        }

        // Gerar token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Salvar na sessão
        req.session.usuarioId = usuario.id;
        req.session.email = usuario.email;

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            user: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            },
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao fazer logout'
            });
        }

        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    });
});

// Verificar se está logado
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.buscarPorEmail(decoded.email);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            user: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
});

module.exports = router;