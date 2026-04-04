const db = require('../database/connection');

class Pagamento {
    static async buscarTodos() {
        const sql = `
            SELECT id, bm, conta_nome, conta_id, data_pagamento, data_key, valor
            FROM pagamentos
            ORDER BY data_key DESC, id ASC
        `;
        return await db.query(sql);
    }

    static async buscarPorFiltros(filtros = {}) {
        let sql = `
            SELECT id, bm, conta_nome, conta_id, data_pagamento, data_key, valor
            FROM pagamentos
            WHERE 1=1
        `;
        const params = [];

        if (filtros.busca) {
            sql += ` AND (bm LIKE ? OR conta_nome LIKE ? OR conta_id LIKE ?)`;
            const busca = `%${filtros.busca}%`;
            params.push(busca, busca, busca);
        }

        if (filtros.bm) {
            sql += ` AND bm = ?`;
            params.push(filtros.bm);
        }

        if (filtros.conta) {
            sql += ` AND (conta_id = ? OR conta_nome = ?)`;
            params.push(filtros.conta, filtros.conta);
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

    static async criar(pagamentos) {
        if (!Array.isArray(pagamentos)) {
            pagamentos = [pagamentos];
        }

        const sql = `
            INSERT INTO pagamentos (id, bm, conta_nome, conta_id, data_pagamento, data_key, valor)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const results = [];
        for (const pag of pagamentos) {
            const params = [
                pag.id,
                pag.bm,
                pag.contaNome,
                pag.contaId || null,
                Pagamento.converterDataParaMySQL(pag.date),
                pag.dk,
                pag.valor
            ];

            const result = await db.query(sql, params);
            results.push(result);
        }

        return results;
    }

    static async atualizar(id, dadosAtualizados) {
        const sql = `
            UPDATE pagamentos
            SET bm = ?, conta_nome = ?, conta_id = ?, data_pagamento = ?, data_key = ?, valor = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const params = [
            dadosAtualizados.bm,
            dadosAtualizados.contaNome,
            dadosAtualizados.contaId || null,
            Pagamento.converterDataParaMySQL(dadosAtualizados.date),
            dadosAtualizados.dk,
            dadosAtualizados.valor,
            id
        ];

        return await db.query(sql, params);
    }

    static async deletar(ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const placeholders = ids.map(() => '?').join(',');
        const sql = `DELETE FROM pagamentos WHERE id IN (${placeholders})`;

        return await db.query(sql, ids);
    }

    static async buscarBMs() {
        const sql = `SELECT DISTINCT bm FROM pagamentos ORDER BY bm ASC`;
        return await db.query(sql);
    }

    static async buscarContasPorBM(bm = null) {
        let sql = `
            SELECT DISTINCT conta_nome, conta_id
            FROM pagamentos
        `;
        const params = [];

        if (bm) {
            sql += ` WHERE bm = ?`;
            params.push(bm);
        }

        sql += ` ORDER BY conta_nome ASC`;

        return await db.query(sql, params);
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
}

module.exports = Pagamento;