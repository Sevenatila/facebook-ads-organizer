const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para verificar autenticação
const verificarAuth = async (req, res, next) => {
    try {
        // Verificar token no header
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acesso não autorizado - Token necessário'
            });
        }

        // Verificar e decodificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuário no banco
        const usuario = await Usuario.buscarPorEmail(decoded.email);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Adicionar usuário ao request
        req.user = {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        console.error('Erro na autenticação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Middleware opcional - não bloqueia se não tiver token
const authOpcional = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const usuario = await Usuario.buscarPorEmail(decoded.email);

            if (usuario) {
                req.user = {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome
                };
            }
        }

        next();

    } catch (error) {
        // Se der erro, continua sem usuário
        next();
    }
};

module.exports = {
    verificarAuth,
    authOpcional
};