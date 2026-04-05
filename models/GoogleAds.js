const db = require('../database/connection');

class GoogleAds {
    static async buscarTodos() {
        const sql = `
            SELECT id, conta_nome, conta_id, data_pagamento, data_key, valor, tipo_campanha, plataforma
            FROM google_ads
            ORDER BY data_key DESC, id ASC
        `;
        return await db.query(sql);
    }

    static async buscarPorFiltros(filtros = {}) {
        let sql = `
            SELECT id, conta_nome, conta_id, data_pagamento, data_key, valor, tipo_campanha, plataforma
            FROM google_ads
            WHERE 1=1
        `;
        const params = [];

        if (filtros.busca) {
            sql += ` AND (conta_nome LIKE ? OR conta_id LIKE ? OR tipo_campanha LIKE ?)`;
            const busca = `%${filtros.busca}%`;
            params.push(busca, busca, busca);
        }

        if (filtros.conta) {
            sql += ` AND (conta_id = ? OR conta_nome = ?)`;
            params.push(filtros.conta, filtros.conta);
        }

        if (filtros.tipo) {
            sql += ` AND tipo_campanha = ?`;
            params.push(filtros.tipo);
        }

        if (filtros.dataInicio) {
            sql += ` AND data_key >= ?`;
            params.push(filtros.dataInicio);
        }

        if (filtros.dataFim) {
            sql += ` AND data_key <= ?`;
            params.push(filtros.dataFim);
        }

        sql += ` ORDER BY data_key DESC, id ASC`;

        return await db.query(sql, params);
    }

    static async criar(campanhas) {
        if (!Array.isArray(campanhas)) {
            campanhas = [campanhas];
        }

        const sql = `
            INSERT INTO google_ads (id, conta_nome, conta_id, data_pagamento, data_key, valor, tipo_campanha, plataforma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const results = [];
        for (const campanha of campanhas) {
            const params = [
                campanha.id,
                campanha.contaNome,
                campanha.contaId || null,
                GoogleAds.converterDataParaMySQL(campanha.date),
                campanha.dk,
                campanha.valor,
                campanha.tipoCampanha || 'Search',
                'Google'
            ];

            const result = await db.query(sql, params);
            results.push(result);
        }

        return results;
    }

    static async atualizar(id, dadosAtualizados) {
        const sql = `
            UPDATE google_ads
            SET conta_nome = ?, conta_id = ?, data_pagamento = ?, data_key = ?, valor = ?, tipo_campanha = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const params = [
            dadosAtualizados.contaNome,
            dadosAtualizados.contaId || null,
            GoogleAds.converterDataParaMySQL(dadosAtualizados.date),
            dadosAtualizados.dk,
            dadosAtualizados.valor,
            dadosAtualizados.tipoCampanha || 'Search',
            id
        ];

        return await db.query(sql, params);
    }

    static async deletar(ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const placeholders = ids.map(() => '?').join(',');
        const sql = `DELETE FROM google_ads WHERE id IN (${placeholders})`;

        return await db.query(sql, ids);
    }

    static async buscarContas() {
        const sql = `SELECT DISTINCT conta_nome, conta_id FROM google_ads ORDER BY conta_nome ASC`;
        return await db.query(sql);
    }

    static async buscarContasPorTipo(tipo = null) {
        let sql = `
            SELECT DISTINCT conta_nome, conta_id, tipo_campanha
            FROM google_ads
        `;
        const params = [];

        if (tipo) {
            sql += ` WHERE tipo_campanha = ?`;
            params.push(tipo);
        }

        sql += ` ORDER BY conta_nome ASC`;

        return await db.query(sql, params);
    }

    static async buscarTiposCampanha() {
        const sql = `SELECT DISTINCT tipo_campanha FROM google_ads ORDER BY tipo_campanha ASC`;
        return await db.query(sql);
    }

    static converterDataParaMySQL(dataStr) {
        if (!dataStr) return null;

        // Converter formato brasileiro para MySQL (YYYY-MM-DD)
        const meses = {
            janeiro: '01', fevereiro: '02', março: '03', marco: '03', abril: '04',
            maio: '05', junho: '06', julho: '07', agosto: '08', setembro: '09',
            outubro: '10', novembro: '11', dezembro: '12',
            jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
            jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
        };

        const match = dataStr.toLowerCase().match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
        if (match) {
            const dia = match[1].padStart(2, '0');
            const mes = meses[match[2]] || '01';
            const ano = match[3];
            return `${ano}-${mes}-${dia}`;
        }

        return dataStr;
    }

    // Método para buscar dados consolidados (Meta + Google)
    static async buscarDadosConsolidados(filtros = {}) {
        try {
            // Buscar dados do Google Ads
            const googleData = await GoogleAds.buscarPorFiltros(filtros);

            // Buscar dados do Meta (usando model Pagamento)
            const Pagamento = require('./Pagamento');
            const metaData = await Pagamento.buscarPorFiltros(filtros);

            // Formatar dados do Google para ter o mesmo padrão
            const googleFormatted = googleData.map(g => ({
                id: g.id,
                bm: g.tipo_campanha, // Usar tipo_campanha como "BM"
                contaNome: g.conta_nome,
                contaId: g.conta_id,
                date: formatarDataBrasileira(g.data_pagamento),
                dk: g.data_key,
                valor: parseFloat(g.valor),
                plataforma: 'Google'
            }));

            // Formatar dados do Meta
            const metaFormatted = metaData.map(m => ({
                id: m.id,
                bm: m.bm,
                contaNome: m.conta_nome,
                contaId: m.conta_id,
                date: formatarDataBrasileira(m.data_pagamento),
                dk: m.data_key,
                valor: parseFloat(m.valor),
                plataforma: 'Meta'
            }));

            // Combinar e ordenar por data
            const dadosConsolidados = [...metaFormatted, ...googleFormatted]
                .sort((a, b) => a.dk.localeCompare(b.dk));

            return {
                consolidado: dadosConsolidados,
                meta: metaFormatted,
                google: googleFormatted
            };

        } catch (error) {
            console.error('Erro ao buscar dados consolidados:', error);
            throw error;
        }
    }
}

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

module.exports = GoogleAds;