require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
    try {
        // Conectar ao MySQL sem especificar banco
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log('Conectado ao MySQL');

        // Criar banco se não existir
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`Banco '${process.env.DB_NAME}' criado/verificado`);

        // Usar o banco
        await connection.execute(`USE ${process.env.DB_NAME}`);

        // Criar tabela de usuários
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                nome VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Tabela de usuários criada/verificada');

        // Criar tabela de pagamentos
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS pagamentos (
                id VARCHAR(50) PRIMARY KEY,
                bm VARCHAR(500) NOT NULL,
                conta_nome VARCHAR(500) NOT NULL,
                conta_id VARCHAR(100),
                data_pagamento DATE NOT NULL,
                data_key VARCHAR(20) NOT NULL,
                valor DECIMAL(12,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_data (data_key),
                INDEX idx_bm (bm(100)),
                INDEX idx_conta (conta_nome(100))
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Tabela de pagamentos criada/verificada');

        await connection.end();
        console.log('Inicialização do banco concluída com sucesso!');

    } catch (error) {
        console.error('Erro ao inicializar banco:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    initDatabase();
}

module.exports = { initDatabase };