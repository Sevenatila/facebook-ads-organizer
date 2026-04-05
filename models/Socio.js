const db = require('../database/connection');

class Socio {
    static async buscarTodos() {
        const sql = `
            SELECT id, nome, email, percentual, ativo, data_entrada, observacoes, created_at, updated_at
            FROM socios
            ORDER BY percentual DESC, nome ASC
        `;
        return await db.query(sql);
    }

    static async buscarAtivos() {
        const sql = `
            SELECT id, nome, email, percentual, ativo, data_entrada, observacoes
            FROM socios
            WHERE ativo = TRUE
            ORDER BY percentual DESC, nome ASC
        `;
        return await db.query(sql);
    }

    static async buscarPorId(id) {
        const sql = 'SELECT * FROM socios WHERE id = ?';
        const socios = await db.query(sql, [id]);
        return socios.length > 0 ? socios[0] : null;
    }

    static async buscarPorEmail(email) {
        const sql = 'SELECT * FROM socios WHERE email = ?';
        const socios = await db.query(sql, [email]);
        return socios.length > 0 ? socios[0] : null;
    }

    static async criar(dadosSocio) {
        // Validar percentual total
        const percentualAtual = await Socio.calcularPercentualTotal();
        const novoPercentual = parseFloat(dadosSocio.percentual) || 0;

        if ((percentualAtual + novoPercentual) > 100) {
            throw new Error(`Percentual excede 100%. Atual: ${percentualAtual}%, Tentando adicionar: ${novoPercentual}%`);
        }

        const sql = `
            INSERT INTO socios (nome, email, percentual, ativo, data_entrada, observacoes)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        try {
            const result = await db.query(sql, [
                dadosSocio.nome,
                dadosSocio.email || null,
                novoPercentual,
                dadosSocio.ativo !== false, // Default true
                dadosSocio.dataEntrada || new Date().toISOString().split('T')[0],
                dadosSocio.observacoes || null
            ]);

            return await Socio.buscarPorId(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email já cadastrado para outro sócio');
            }
            throw error;
        }
    }

    static async atualizar(id, dadosAtualizados) {
        // Verificar se sócio existe
        const socioAtual = await Socio.buscarPorId(id);
        if (!socioAtual) {
            throw new Error('Sócio não encontrado');
        }

        // Validar percentual total se estiver sendo alterado
        if (dadosAtualizados.percentual !== undefined) {
            const percentualTotal = await Socio.calcularPercentualTotal();
            const percentualAtualSocio = parseFloat(socioAtual.percentual);
            const novoPercentualSocio = parseFloat(dadosAtualizados.percentual);
            const novoTotal = (percentualTotal - percentualAtualSocio) + novoPercentualSocio;

            if (novoTotal > 100) {
                throw new Error(`Percentual excede 100%. Total ficaria: ${novoTotal.toFixed(2)}%`);
            }
        }

        const sql = `
            UPDATE socios
            SET nome = ?, email = ?, percentual = ?, ativo = ?, data_entrada = ?, observacoes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await db.query(sql, [
            dadosAtualizados.nome || socioAtual.nome,
            dadosAtualizados.email !== undefined ? dadosAtualizados.email : socioAtual.email,
            dadosAtualizados.percentual !== undefined ? dadosAtualizados.percentual : socioAtual.percentual,
            dadosAtualizados.ativo !== undefined ? dadosAtualizados.ativo : socioAtual.ativo,
            dadosAtualizados.dataEntrada || socioAtual.data_entrada,
            dadosAtualizados.observacoes !== undefined ? dadosAtualizados.observacoes : socioAtual.observacoes,
            id
        ]);

        return await Socio.buscarPorId(id);
    }

    static async deletar(id) {
        const sql = 'DELETE FROM socios WHERE id = ?';
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    static async calcularPercentualTotal() {
        const sql = `
            SELECT SUM(percentual) as total
            FROM socios
            WHERE ativo = TRUE
        `;
        const resultado = await db.query(sql);
        return parseFloat(resultado[0]?.total || 0);
    }

    static async calcularDistribuicao(valorTotal) {
        const sociosAtivos = await Socio.buscarAtivos();
        const percentualTotal = await Socio.calcularPercentualTotal();

        if (percentualTotal === 0) {
            return {
                distribuicao: [],
                valorDistribuido: 0,
                valorRestante: valorTotal,
                percentualTotal: 0
            };
        }

        const distribuicao = sociosAtivos.map(socio => {
            const valorSocio = (valorTotal * parseFloat(socio.percentual)) / 100;
            return {
                id: socio.id,
                nome: socio.nome,
                percentual: parseFloat(socio.percentual),
                valor: valorSocio
            };
        });

        const valorDistribuido = distribuicao.reduce((sum, item) => sum + item.valor, 0);

        return {
            distribuicao,
            valorDistribuido,
            valorRestante: valorTotal - valorDistribuido,
            percentualTotal,
            percentualRestante: 100 - percentualTotal
        };
    }

    static async ativarDesativar(id, ativo = true) {
        const sql = `
            UPDATE socios
            SET ativo = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const result = await db.query(sql, [ativo, id]);
        return result.affectedRows > 0;
    }

    static async listarPorPercentual() {
        const sql = `
            SELECT nome, percentual, ativo
            FROM socios
            ORDER BY percentual DESC, nome ASC
        `;
        return await db.query(sql);
    }

    // Método para relatório de sócios
    static async gerarRelatorio() {
        const sociosAtivos = await Socio.buscarAtivos();
        const percentualTotal = await Socio.calcularPercentualTotal();
        const totalSocios = sociosAtivos.length;

        return {
            socios: sociosAtivos,
            resumo: {
                totalSocios,
                percentualDistribuido: percentualTotal,
                percentualDisponivel: 100 - percentualTotal,
                socioMaiorParticipacao: sociosAtivos[0] || null,
                mediaPercentual: totalSocios > 0 ? percentualTotal / totalSocios : 0
            }
        };
    }
}

module.exports = Socio;