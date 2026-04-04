require('dotenv').config();
const Pagamento = require('../models/Pagamento');

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

async function seedData() {
    console.log('🌱 Inserindo dados de exemplo...');

    const bm = 'BM - Yj Participacoes E Servicos Ltda';

    const dados = [
        // MKT Magazzi 4
        [bm, 'MKT Magazzi 4', '165145608890100', '29 de março de 2026', '13204.64'],
        [bm, 'MKT Magazzi 4', '165145608890100', '01 de abril de 2026', '13718.13'],
        [bm, 'MKT Magazzi 4', '165145608890100', '02 de abril de 2026', '2784.00'],
        [bm, 'MKT Magazzi 4', '165145608890100', '02 de abril de 2026', '8378.40'],
        [bm, 'MKT Magazzi 4', '165145608890100', '02 de abril de 2026', '8353.99'],
        [bm, 'MKT Magazzi 4', '165145608890100', '03 de abril de 2026', '9292.10'],

        // MKT Magazzi 2
        [bm, 'MKT Magazzi 2', '317155313215000', '30 de março de 2026', '1594.53'],
        [bm, 'MKT Magazzi 2', '317155313215000', '30 de março de 2026', '3189.03'],
        [bm, 'MKT Magazzi 2', '317155313215000', '30 de março de 2026', '1594.51'],
        [bm, 'MKT Magazzi 2', '317155313215000', '30 de março de 2026', '12756.14'],
        [bm, 'MKT Magazzi 2', '317155313215000', '31 de março de 2026', '400.55'],
        [bm, 'MKT Magazzi 2', '317155313215000', '31 de março de 2026', '1602.19'],
        [bm, 'MKT Magazzi 2', '317155313215000', '01 de abril de 2026', '1417.49'],
        [bm, 'MKT Magazzi 2', '317155313215000', '02 de abril de 2026', '11091.77'],
        [bm, 'MKT Magazzi 2', '317155313215000', '02 de abril de 2026', '2737.09'],
        [bm, 'MKT Magazzi 2', '317155313215000', '03 de abril de 2026', '9151.03'],
        [bm, 'MKT Magazzi 2', '317155313215000', '03 de abril de 2026', '9098.22'],
        [bm, 'MKT Magazzi 2', '317155313215000', '03 de abril de 2026', '8948.26'],

        // MKT Magazzi 5
        [bm, 'MKT Magazzi 5', '323722022685595', '30 de março de 2026', '3416.68'],
        [bm, 'MKT Magazzi 5', '323722022685595', '30 de março de 2026', '4057.55'],
        [bm, 'MKT Magazzi 5', '323722022685595', '30 de março de 2026', '7578.88'],
        [bm, 'MKT Magazzi 5', '323722022685595', '30 de março de 2026', '3416.26'],
        [bm, 'MKT Magazzi 5', '323722022685595', '01 de abril de 2026', '8698.40'],
        [bm, 'MKT Magazzi 5', '323722022685595', '02 de abril de 2026', '4861.70'],
        [bm, 'MKT Magazzi 5', '323722022685595', '02 de abril de 2026', '2000.00'],
        [bm, 'MKT Magazzi 5', '323722022685595', '02 de abril de 2026', '5623.33'],
        [bm, 'MKT Magazzi 5', '323722022685595', '02 de abril de 2026', '3423.03'],
        [bm, 'MKT Magazzi 5', '323722022685595', '03 de abril de 2026', '19668.03']
    ];

    const MO = {
        janeiro: 1, fevereiro: 2, março: 3, marco: 3, abril: 4, maio: 5, junho: 6,
        julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12
    };

    function dateKey(str) {
        if (!str) return '9999-99-99';
        const m = str.toLowerCase().replace('ç','c').match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
        if (!m) return str.toLowerCase();
        const mon = MO[m[2]] || MO[m[2].slice(0,3)] || 0;
        return `${m[3]}-${String(mon).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    }

    const pagamentos = dados.map(([bm, contaNome, contaId, date, valor]) => ({
        id: uid(),
        bm,
        contaNome,
        contaId,
        date,
        dk: dateKey(date),
        valor: parseFloat(valor),
        dataMySQL: dateKey(date) // Usar a versão convertida para MySQL
    }));

    try {
        // Verificar se já existem dados
        const existentes = await Pagamento.buscarTodos();

        if (existentes.length > 0) {
            console.log('⚠️  Dados já existem no banco. Para recriar, delete os dados existentes primeiro.');
            return;
        }

        // Inserir dados
        await Pagamento.criar(pagamentos);

        console.log(`✅ ${pagamentos.length} pagamentos inseridos com sucesso!`);

        // Mostrar totais
        const magazzi4Total = pagamentos.filter(p => p.contaNome === 'MKT Magazzi 4').reduce((s, p) => s + p.valor, 0);
        const magazzi2Total = pagamentos.filter(p => p.contaNome === 'MKT Magazzi 2').reduce((s, p) => s + p.valor, 0);
        const magazzi5Total = pagamentos.filter(p => p.contaNome === 'MKT Magazzi 5').reduce((s, p) => s + p.valor, 0);
        const totalGeral = pagamentos.reduce((s, p) => s + p.valor, 0);

        console.log('\n📊 Totais inseridos:');
        console.log(`- MKT Magazzi 4: R$ ${magazzi4Total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`- MKT Magazzi 2: R$ ${magazzi2Total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`- MKT Magazzi 5: R$ ${magazzi5Total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
        console.log(`- TOTAL GERAL: R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    } catch (error) {
        console.error('❌ Erro ao inserir dados:', error);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedData().then(() => {
        process.exit(0);
    });
}

module.exports = { seedData };