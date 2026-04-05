require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrationV2() {
    try {
        // Conectar ao MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('🔄 Iniciando migração para v2.0...');

        // 1. Tabela de campanhas Google Ads
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS google_ads (
                id VARCHAR(50) PRIMARY KEY,
                conta_nome VARCHAR(500) NOT NULL,
                conta_id VARCHAR(100),
                data_pagamento DATE NOT NULL,
                data_key VARCHAR(20) NOT NULL,
                valor DECIMAL(12,2) NOT NULL,
                tipo_campanha VARCHAR(100) DEFAULT 'Search',
                plataforma VARCHAR(20) DEFAULT 'Google',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_data_google (data_key),
                INDEX idx_conta_google (conta_nome(100)),
                INDEX idx_plataforma (plataforma)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ Tabela google_ads criada/verificada');

        // 2. Tabela de sócios
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS socios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                percentual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                ativo BOOLEAN DEFAULT TRUE,
                data_entrada DATE,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_ativo (ativo),
                INDEX idx_nome (nome)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ Tabela socios criada/verificada');

        // 3. Adicionar coluna 'plataforma' na tabela existente de pagamentos
        try {
            await connection.execute(`
                ALTER TABLE pagamentos
                ADD COLUMN plataforma VARCHAR(20) DEFAULT 'Meta' AFTER valor
            `);
            console.log('✅ Coluna plataforma adicionada à tabela pagamentos');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  Coluna plataforma já existe na tabela pagamentos');
            } else {
                throw error;
            }
        }

        // 4. Atualizar registros existentes para ter plataforma = 'Meta'
        await connection.execute(`
            UPDATE pagamentos
            SET plataforma = 'Meta'
            WHERE plataforma IS NULL OR plataforma = ''
        `);

        console.log('✅ Registros existentes atualizados com plataforma = Meta');

        // 5. Inserir sócios de exemplo
        const sociosExemplo = [
            ['Renato Stelar', 'renato@code.com', 50.00, true, '2024-01-01'],
            ['Vinicius Code', 'vini@code.com', 50.00, true, '2024-01-01']
        ];

        for (const socio of sociosExemplo) {
            try {
                await connection.execute(`
                    INSERT INTO socios (nome, email, percentual, ativo, data_entrada)
                    VALUES (?, ?, ?, ?, ?)
                `, socio);
            } catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    console.log(`ℹ️  Sócio ${socio[0]} pode já existir`);
                }
            }
        }

        console.log('✅ Sócios de exemplo inseridos');

        // 6. Inserir dados de exemplo Google Ads
        const googleAdsExemplo = [
            {
                id: `gads_${Date.now()}_1`,
                conta_nome: 'Magazzi - Search',
                conta_id: 'magazzi-search-001',
                data_pagamento: '2024-04-01',
                data_key: '2024-04-01',
                valor: 2500.00,
                tipo_campanha: 'Search'
            },
            {
                id: `gads_${Date.now()}_2`,
                conta_nome: 'Magazzi - Display',
                conta_id: 'magazzi-display-001',
                data_pagamento: '2024-04-02',
                data_key: '2024-04-02',
                valor: 1800.00,
                tipo_campanha: 'Display'
            },
            {
                id: `gads_${Date.now()}_3`,
                conta_nome: 'Magazzi - Shopping',
                conta_id: 'magazzi-shopping-001',
                data_pagamento: '2024-04-03',
                data_key: '2024-04-03',
                valor: 3200.00,
                tipo_campanha: 'Shopping'
            }
        ];

        for (const gads of googleAdsExemplo) {
            try {
                await connection.execute(`
                    INSERT INTO google_ads (id, conta_nome, conta_id, data_pagamento, data_key, valor, tipo_campanha)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [gads.id, gads.conta_nome, gads.conta_id, gads.data_pagamento, gads.data_key, gads.valor, gads.tipo_campanha]);
            } catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    console.log(`ℹ️  Registro Google Ads pode já existir: ${gads.conta_nome}`);
                }
            }
        }

        console.log('✅ Dados de exemplo Google Ads inseridos');

        await connection.end();
        console.log('🎉 Migração v2.0 concluída com sucesso!');

        // Mostrar resumo
        console.log('\n📊 Resumo da migração:');
        console.log('- ✅ Tabela google_ads criada');
        console.log('- ✅ Tabela socios criada');
        console.log('- ✅ Coluna plataforma adicionada');
        console.log('- ✅ Dados de exemplo inseridos');
        console.log('- ✅ Sistema pronto para multi-plataforma');

    } catch (error) {
        console.error('❌ Erro na migração:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    migrationV2().then(() => {
        console.log('\n🚀 Sistema atualizado para v2.0!');
        process.exit(0);
    });
}

module.exports = { migrationV2 };