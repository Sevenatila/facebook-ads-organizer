// Teste rápido para verificar se a aplicação está funcionando
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('🔍 Testando configuração...');

    try {
        // Testar conexão MySQL
        console.log('📊 Testando MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Conexão MySQL funcionando');
        await connection.end();

        // Verificar se o banco existe
        const dbConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'facebook_ads_organizer',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Banco de dados acessível');

        // Testar tabela
        const [rows] = await dbConnection.execute('SHOW TABLES LIKE "pagamentos"');
        if (rows.length > 0) {
            console.log('✅ Tabela de pagamentos existe');

            // Contar registros
            const [count] = await dbConnection.execute('SELECT COUNT(*) as total FROM pagamentos');
            console.log(`📊 Total de registros: ${count[0].total}`);
        } else {
            console.log('⚠️  Tabela de pagamentos não encontrada - execute: npm run init-db');
        }

        await dbConnection.end();

    } catch (error) {
        console.error('❌ Erro na configuração:', error.message);
        console.log('\n🔧 Soluções:');
        console.log('1. Verificar se MySQL está rodando');
        console.log('2. Verificar credenciais no arquivo .env');
        console.log('3. Executar: npm run init-db');
    }
}

// Verificar variáveis de ambiente
console.log('⚙️  Configurações atuais:');
console.log('- DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('- DB_USER:', process.env.DB_USER || 'root');
console.log('- DB_NAME:', process.env.DB_NAME || 'facebook_ads_organizer');
console.log('- DB_PORT:', process.env.DB_PORT || 3306);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 3000);
console.log('');

testConnection();