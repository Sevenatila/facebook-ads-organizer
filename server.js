require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e performance
app.use(helmet({
    contentSecurityPolicy: false, // Desabilitar CSP temporariamente para desenvolvimento
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://seudominio.com', 'http://seudominio.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar sessões
app.use(session({
    secret: process.env.JWT_SECRET || 'facebook-ads-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    }
}));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação
const { authOpcional } = require('./middleware/auth');

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pagamentos', authOpcional, require('./routes/pagamentos'));
app.use('/api/google-ads', authOpcional, require('./routes/google-ads'));
app.use('/api/socios', authOpcional, require('./routes/socios'));
app.use('/api/custos', authOpcional, require('./routes/custos'));

// Rota para migração de dados do localStorage
app.post('/api/migrate', async (req, res) => {
    try {
        const { records } = req.body;

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({
                success: false,
                message: 'Dados de migração inválidos'
            });
        }

        const Pagamento = require('./models/Pagamento');

        // Verificar se já existem dados no banco
        const existentes = await Pagamento.buscarTodos();
        if (existentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Banco já contém dados. Migração cancelada para evitar duplicação.'
            });
        }

        // Migrar dados
        const result = await Pagamento.criar(records);

        res.json({
            success: true,
            message: `${records.length} registro(s) migrado(s) com sucesso`,
            migrated: records.length
        });

    } catch (error) {
        console.error('Erro na migração:', error);
        res.status(500).json({
            success: false,
            message: 'Erro na migração dos dados',
            error: error.message
        });
    }
});

// Rota de saúde da API
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Rota de login
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota principal - servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Middleware de tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
    });
});

// Inicializar servidor
async function startServer() {
    try {
        // Testar conexão com banco
        const db = require('./database/connection');
        await db.query('SELECT 1');
        console.log('Conexão com banco testada com sucesso');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
            console.log(`📊 Dashboard: http://localhost:${PORT}`);
            console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor...');
    const db = require('./database/connection');
    await db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando servidor...');
    const db = require('./database/connection');
    await db.close();
    process.exit(0);
});

startServer();