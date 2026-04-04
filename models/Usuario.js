const db = require('../database/connection');

class Usuario {
    static async buscarPorEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const usuarios = await db.query(sql, [email]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    static async criar(email, nome = '') {
        const sql = `
            INSERT INTO usuarios (email, nome, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `;

        try {
            await db.query(sql, [email, nome || email]);
            return await this.buscarPorEmail(email);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return await this.buscarPorEmail(email);
            }
            throw error;
        }
    }

    static async listarTodos() {
        const sql = 'SELECT id, email, nome, created_at FROM usuarios ORDER BY created_at DESC';
        return await db.query(sql);
    }

    static async atualizar(id, dados) {
        const sql = 'UPDATE usuarios SET nome = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        return await db.query(sql, [dados.nome, id]);
    }

    static async deletar(id) {
        const sql = 'DELETE FROM usuarios WHERE id = ?';
        return await db.query(sql, [id]);
    }
}

module.exports = Usuario;