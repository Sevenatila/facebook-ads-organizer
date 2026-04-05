/**
 * Script de teste local v2.0
 * Testa o sistema sem necessidade de banco de dados configurado
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001; // Porta diferente para não conflitar

console.log('🧪 Iniciando teste local v2.0...');

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dados mock para teste
let mockPagamentos = [
    {
        id: 'meta_1',
        bm: 'BM - Yj Participacoes E Servicos Ltda',
        contaNome: 'MKT Magazzi 4',
        contaId: '165145608890100',
        date: '29 de março de 2024',
        dk: '2024-03-29',
        valor: 13204.64,
        plataforma: 'Meta'
    },
    {
        id: 'meta_2',
        bm: 'BM - Yj Participacoes E Servicos Ltda',
        contaNome: 'MKT Magazzi 2',
        contaId: '317155313215000',
        date: '30 de março de 2024',
        dk: '2024-03-30',
        valor: 9534.21,
        plataforma: 'Meta'
    }
];

let mockGoogleAds = [
    {
        id: 'google_1',
        contaNome: 'Magazzi - Search',
        contaId: 'magazzi-search-001',
        date: '1 de abril de 2024',
        dk: '2024-04-01',
        valor: 2500.00,
        tipoCampanha: 'Search',
        plataforma: 'Google'
    },
    {
        id: 'google_2',
        contaNome: 'Magazzi - Display',
        contaId: 'magazzi-display-001',
        date: '2 de abril de 2024',
        dk: '2024-04-02',
        valor: 1800.00,
        tipoCampanha: 'Display',
        plataforma: 'Google'
    }
];

let mockSocios = [
    {
        id: 1,
        nome: 'Renato Stelar',
        email: 'renato@code.com',
        percentual: 50.00,
        ativo: true,
        dataEntrada: '2024-01-01'
    },
    {
        id: 2,
        nome: 'Vinicius Code',
        email: 'vini@code.com',
        percentual: 50.00,
        ativo: true,
        dataEntrada: '2024-01-01'
    }
];

// Mock Auth - sempre autorizado para teste
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    res.json({
        success: true,
        message: 'Login realizado com sucesso (TESTE)',
        user: { id: 1, email, nome: email.split('@')[0] },
        token: 'test-token-12345'
    });
});

app.get('/api/auth/me', (req, res) => {
    res.json({
        success: true,
        user: { id: 1, email: 'test@code.com', nome: 'Teste' }
    });
});

// Mock Pagamentos (Meta)
app.get('/api/pagamentos', (req, res) => {
    const filteredData = mockPagamentos.map(p => ({
        ...p,
        valor: parseFloat(p.valor)
    }));

    res.json({
        success: true,
        data: filteredData,
        total: filteredData.length
    });
});

app.get('/api/pagamentos/bms', (req, res) => {
    const bms = [...new Set(mockPagamentos.map(p => p.bm))];
    res.json({
        success: true,
        data: bms
    });
});

app.get('/api/pagamentos/contas', (req, res) => {
    const contas = mockPagamentos.map(p => ({
        id: p.contaId || p.contaNome,
        nome: p.contaNome
    }));
    res.json({
        success: true,
        data: contas
    });
});

// Mock Google Ads
app.get('/api/google-ads', (req, res) => {
    const filteredData = mockGoogleAds.map(g => ({
        ...g,
        valor: parseFloat(g.valor)
    }));

    res.json({
        success: true,
        data: filteredData,
        total: filteredData.length
    });
});

app.get('/api/google-ads/contas', (req, res) => {
    const contas = mockGoogleAds.map(g => ({
        id: g.contaId || g.contaNome,
        nome: g.contaNome
    }));
    res.json({
        success: true,
        data: contas
    });
});

app.get('/api/google-ads/tipos', (req, res) => {
    const tipos = [...new Set(mockGoogleAds.map(g => g.tipoCampanha))];
    res.json({
        success: true,
        data: tipos
    });
});

app.get('/api/google-ads/consolidado', (req, res) => {
    // Combinar dados Meta + Google
    const metaFormatted = mockPagamentos.map(m => ({
        ...m,
        bm: m.bm || 'Meta Ads'
    }));

    const googleFormatted = mockGoogleAds.map(g => ({
        ...g,
        bm: g.tipoCampanha || 'Google Ads'
    }));

    const consolidado = [...metaFormatted, ...googleFormatted]
        .sort((a, b) => a.dk.localeCompare(b.dk));

    res.json({
        success: true,
        data: {
            consolidado,
            meta: metaFormatted,
            google: googleFormatted
        }
    });
});

// Mock Sócios
app.get('/api/socios', (req, res) => {
    res.json({
        success: true,
        data: mockSocios
    });
});

app.get('/api/socios/ativos', (req, res) => {
    const sociosAtivos = mockSocios.filter(s => s.ativo);
    res.json({
        success: true,
        data: sociosAtivos
    });
});

app.post('/api/socios/distribuicao', (req, res) => {
    const { valorTotal } = req.body;
    const sociosAtivos = mockSocios.filter(s => s.ativo);

    const distribuicao = sociosAtivos.map(socio => ({
        id: socio.id,
        nome: socio.nome,
        percentual: socio.percentual,
        valor: (valorTotal * socio.percentual) / 100
    }));

    const valorDistribuido = distribuicao.reduce((sum, item) => sum + item.valor, 0);

    res.json({
        success: true,
        data: {
            distribuicao,
            valorDistribuido,
            valorRestante: valorTotal - valorDistribuido,
            percentualTotal: sociosAtivos.reduce((sum, s) => sum + s.percentual, 0)
        }
    });
});

app.get('/api/socios/percentual/total', (req, res) => {
    const percentualTotal = mockSocios
        .filter(s => s.ativo)
        .reduce((sum, s) => sum + s.percentual, 0);

    res.json({
        success: true,
        data: {
            percentualDistribuido: percentualTotal,
            percentualDisponivel: 100 - percentualTotal
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API v2.0 funcionando (MODO TESTE)',
        timestamp: new Date().toISOString(),
        version: '2.0.0-test'
    });
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('✅ Dados mock carregados:');
    console.log(`   - ${mockPagamentos.length} pagamentos Meta`);
    console.log(`   - ${mockGoogleAds.length} campanhas Google Ads`);
    console.log(`   - ${mockSocios.length} sócios`);
    console.log('');
    console.log('🧪 Teste todas as funcionalidades do v2.0!');
});