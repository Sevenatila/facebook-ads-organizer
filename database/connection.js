require('dotenv').config();
const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.pool = null;
        this.connect();
    }

    async connect() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                acquireTimeout: 60000,
                timeout: 60000,
                reconnect: true
            });

            // Testar conexão
            const connection = await this.pool.getConnection();
            console.log('Conectado ao banco MySQL');
            connection.release();
        } catch (error) {
            console.error('Erro ao conectar com o banco:', error);
            throw error;
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Erro na query:', error);
            throw error;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('Conexão com banco encerrada');
        }
    }
}

module.exports = new Database();