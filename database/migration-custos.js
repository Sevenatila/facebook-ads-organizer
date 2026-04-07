require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateCustos() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Conectado ao MySQL');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS custos_operacionais (
                id INT AUTO_INCREMENT PRIMARY KEY,
                categoria ENUM('codigo', 'info_card', 'ferramenta') NOT NULL,
                descricao VARCHAR(500) NOT NULL,
                valor DECIMAL(12,2) NOT NULL,
                data DATE NOT NULL,
                observacao TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_categoria (categoria),
                INDEX idx_data (data)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Tabela custos_operacionais criada/verificada com sucesso!');
        await connection.end();
    } catch (error) {
        console.error('Erro na migration:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
}

if (require.main === module) {
    migrateCustos();
}

module.exports = { migrateCustos };
