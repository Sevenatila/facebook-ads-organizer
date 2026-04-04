require('dotenv').config();
const db = require('./connection');

async function quickSeed() {
    console.log('🌱 Inserindo dados via SQL direto...');

    try {
        // Verificar se já existem dados
        const existentes = await db.query('SELECT COUNT(*) as count FROM pagamentos');

        if (existentes[0].count > 0) {
            console.log('⚠️  Dados já existem no banco.');
            return;
        }

        // Inserir dados direto via SQL com datas no formato correto
        const sql = `
            INSERT INTO pagamentos (id, bm, conta_nome, conta_id, data_pagamento, data_key, valor) VALUES
            ('${Date.now()}1', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-03-29', '2026-03-29', 13204.64),
            ('${Date.now()}2', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-04-01', '2026-04-01', 13718.13),
            ('${Date.now()}3', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-04-02', '2026-04-02', 2784.00),
            ('${Date.now()}4', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-04-02', '2026-04-02', 8378.40),
            ('${Date.now()}5', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-04-02', '2026-04-02', 8353.99),
            ('${Date.now()}6', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 4', '165145608890100', '2026-04-03', '2026-04-03', 9292.10),

            ('${Date.now()}7', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-30', '2026-03-30', 1594.53),
            ('${Date.now()}8', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-30', '2026-03-30', 3189.03),
            ('${Date.now()}9', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-30', '2026-03-30', 1594.51),
            ('${Date.now()}10', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-30', '2026-03-30', 12756.14),
            ('${Date.now()}11', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-31', '2026-03-31', 400.55),
            ('${Date.now()}12', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-03-31', '2026-03-31', 1602.19),
            ('${Date.now()}13', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-01', '2026-04-01', 1417.49),
            ('${Date.now()}14', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-02', '2026-04-02', 11091.77),
            ('${Date.now()}15', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-02', '2026-04-02', 2737.09),
            ('${Date.now()}16', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-03', '2026-04-03', 9151.03),
            ('${Date.now()}17', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-03', '2026-04-03', 9098.22),
            ('${Date.now()}18', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 2', '317155313215000', '2026-04-03', '2026-04-03', 8948.26),

            ('${Date.now()}19', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-03-30', '2026-03-30', 3416.68),
            ('${Date.now()}20', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-03-30', '2026-03-30', 4057.55),
            ('${Date.now()}21', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-03-30', '2026-03-30', 7578.88),
            ('${Date.now()}22', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-03-30', '2026-03-30', 3416.26),
            ('${Date.now()}23', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-01', '2026-04-01', 8698.40),
            ('${Date.now()}24', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-02', '2026-04-02', 4861.70),
            ('${Date.now()}25', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-02', '2026-04-02', 2000.00),
            ('${Date.now()}26', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-02', '2026-04-02', 5623.33),
            ('${Date.now()}27', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-02', '2026-04-02', 3423.03),
            ('${Date.now()}28', 'BM - Yj Participacoes E Servicos Ltda', 'MKT Magazzi 5', '323722022685595', '2026-04-03', '2026-04-03', 19668.03);
        `;

        await db.query(sql);

        console.log('✅ 28 pagamentos inseridos com sucesso via SQL!');

        // Mostrar totais
        const totais = await db.query(`
            SELECT conta_nome, SUM(valor) as total
            FROM pagamentos
            GROUP BY conta_nome
            ORDER BY conta_nome
        `);

        console.log('\n📊 Totais inseridos:');
        totais.forEach(row => {
            console.log(`- ${row.conta_nome}: R$ ${Number(row.total).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        });

        const totalGeral = await db.query('SELECT SUM(valor) as total FROM pagamentos');
        console.log(`- TOTAL GERAL: R$ ${Number(totalGeral[0].total).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    quickSeed().then(() => {
        process.exit(0);
    });
}

module.exports = { quickSeed };