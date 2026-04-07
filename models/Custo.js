const db = require('../database/connection');

class Custo {
    static async buscarTodos(filtros = {}) {
        let sql = `
            SELECT id, categoria, descricao, valor, data, observacao, created_at
            FROM custos_operacionais
            WHERE 1=1
        `;
        const params = [];

        if (filtros.categoria) {
            sql += ` AND categoria = ?`;
            params.push(filtros.categoria);
        }

        if (filtros.dataInicio) {
            sql += ` AND data >= ?`;
            params.push(filtros.dataInicio);
        }

        if (filtros.dataFim) {
            sql += ` AND data <= ?`;
            params.push(filtros.dataFim);
        }

        if (filtros.busca) {
            sql += ` AND descricao LIKE ?`;
            params.push(`%${filtros.busca}%`);
        }

        sql += ` ORDER BY data DESC, id DESC`;

        return await db.query(sql, params);
    }

    static async buscarPorId(id) {
        const sql = `SELECT * FROM custos_operacionais WHERE id = ?`;
        const rows = await db.query(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async criar(dados) {
        const sql = `
            INSERT INTO custos_operacionais (categoria, descricao, valor, data, observacao)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
            dados.categoria,
            dados.descricao,
            parseFloat(dados.valor),
            dados.data,
            dados.observacao || null
        ]);
        return await Custo.buscarPorId(result.insertId);
    }

    static async atualizar(id, dados) {
        const sql = `
            UPDATE custos_operacionais
            SET categoria = ?, descricao = ?, valor = ?, data = ?, observacao = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const result = await db.query(sql, [
            dados.categoria,
            dados.descricao,
            parseFloat(dados.valor),
            dados.data,
            dados.observacao || null,
            id
        ]);
        return result.affectedRows > 0;
    }

    static async deletar(id) {
        const sql = `DELETE FROM custos_operacionais WHERE id = ?`;
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    static async resumoPorCategoria() {
        const sql = `
            SELECT
                categoria,
                COUNT(*) as quantidade,
                SUM(valor) as total
            FROM custos_operacionais
            GROUP BY categoria
        `;
        return await db.query(sql);
    }
}

module.exports = Custo;
