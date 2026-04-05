# Facebook Ads Organizer v2.0

Sistema completo de gestão multi-plataforma para Meta/Facebook Ads e Google Ads com dashboard interativo e gestão de sócios.

## 🆕 Novidades v2.0

- ✅ **Suporte ao Google Ads** - Gestão completa de campanhas Google
- ✅ **Sistema de abas** - Navegação entre Meta, Google, Visão Geral e Sócios
- ✅ **Gestão de sócios** - Controle de participação societária e distribuição de lucros
- ✅ **Dashboard consolidado** - Visão unificada de Meta + Google Ads
- ✅ **Novos endpoints da API** - APIs REST para todas as funcionalidades
- ✅ **Interface moderna** - Sistema de abas com transições suaves

## 🚀 Características

- ✅ **Dashboard moderno** com tema escuro profissional
- ✅ **Multi-plataforma** - Meta/Facebook Ads + Google Ads
- ✅ **API REST completa** com Node.js + Express + MySQL
- ✅ **Migração automática** do localStorage e dados v1.0
- ✅ **Parser inteligente** para texto do Facebook e Google
- ✅ **Export CSV** completo e consolidado
- ✅ **Gestão de sócios** com distribuição automática
- ✅ **Deploy automatizado** com PM2

## 🔧 Tecnologias

- **Backend**: Node.js, Express.js
- **Banco**: MySQL 8.x
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Deploy**: PM2, Linux VPS
- **Segurança**: Helmet, CORS, JWT, dotenv

## 🏗️ Instalação Local

### Pré-requisitos

- Node.js 16+
- MySQL 5.7+
- Git

### 1. Clonar o Projeto

```bash
git clone <seu-repositorio>
cd facebook-ads-organizer
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

### 4. Inicializar Banco v2.0

```bash
npm run init-db
npm run migrate-v2
```

### 5. Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Teste local (sem banco)
node test-local-v2.js
```

## 🌐 Deploy na VPS Hostinger

### 1. Preparar VPS

```bash
# Fazer upload do install-vps.sh para sua VPS
chmod +x install-vps.sh
./install-vps.sh
```

### 2. Configurar MySQL

```bash
sudo mysql -u root -p

# Criar banco e usuário
CREATE DATABASE facebook_ads_organizer;
CREATE USER 'fbads'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON facebook_ads_organizer.* TO 'fbads'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Deploy v2.0

```bash
# Clonar projeto
git clone <seu-repositorio>
cd facebook-ads-organizer

# Configurar .env
cp .env.example .env
nano .env

# Executar deploy v2.0
chmod +x deploy-v2.sh
./deploy-v2.sh
```

## 📊 Estrutura da API v2.0

### Endpoints Meta/Facebook

- `GET /api/pagamentos` - Listar pagamentos Meta com filtros
- `POST /api/pagamentos` - Criar novos pagamentos
- `DELETE /api/pagamentos` - Deletar pagamentos
- `GET /api/pagamentos/bms` - Listar Business Managers
- `GET /api/pagamentos/contas` - Listar contas por BM

### Endpoints Google Ads

- `GET /api/google-ads` - Listar campanhas Google Ads
- `POST /api/google-ads` - Criar novas campanhas
- `DELETE /api/google-ads` - Deletar campanhas
- `GET /api/google-ads/contas` - Listar contas Google
- `GET /api/google-ads/tipos` - Listar tipos de campanha
- `GET /api/google-ads/consolidado` - Dados consolidados Meta+Google

### Endpoints Sócios

- `GET /api/socios` - Listar todos os sócios
- `GET /api/socios/ativos` - Listar sócios ativos
- `POST /api/socios` - Criar novo sócio
- `PUT /api/socios/:id` - Atualizar sócio
- `DELETE /api/socios/:id` - Remover sócio
- `POST /api/socios/distribuicao` - Calcular distribuição de lucros
- `GET /api/socios/percentual/total` - Percentual total distribuído

### Endpoints Utilitários

- `POST /api/migrate` - Migrar dados do localStorage
- `GET /api/health` - Status da API
- `POST /api/auth/login` - Login por email
- `GET /api/auth/me` - Verificar sessão

### Exemplos de Uso

```javascript
// Buscar dados consolidados Meta + Google
GET /api/google-ads/consolidado?dataInicio=2024-01-01&dataFim=2024-12-31

// Criar campanhas Google Ads
POST /api/google-ads
{
  "campanhas": [
    {
      "id": "gads_123",
      "contaNome": "Magazzi - Search",
      "contaId": "magazzi-001",
      "date": "15 de janeiro de 2024",
      "dk": "2024-01-15",
      "valor": 2500.00,
      "tipoCampanha": "Search"
    }
  ]
}

// Calcular distribuição para sócios
POST /api/socios/distribuicao
{
  "valorTotal": 10000.00
}

// Criar novo sócio
POST /api/socios
{
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "percentual": 25.00,
  "ativo": true,
  "dataEntrada": "2024-01-01"
}
```

## 🔒 Segurança v2.0

- ✅ Headers de segurança com Helmet
- ✅ CORS configurado para produção
- ✅ Autenticação JWT com expiração
- ✅ Validação rigorosa de entrada
- ✅ Sanitização de dados
- ✅ Emails autorizados (renato@code.com, vini@code.com)
- ✅ Timeouts de conexão
- ✅ Rate limiting (recomendado)

## 📝 Comandos Úteis

```bash
# Migração para v2.0
npm run migrate-v2

# Ver logs da aplicação
pm2 logs facebook-ads-organizer

# Restart da aplicação
pm2 restart facebook-ads-organizer

# Status dos processos
pm2 status

# Monitoramento
pm2 monit

# Backup do banco v2.0
mysqldump -u fbads -p facebook_ads_organizer > backup-v2.sql

# Restore do banco
mysql -u fbads -p facebook_ads_organizer < backup-v2.sql

# Teste local (sem banco necessário)
node test-local-v2.js
```

## 🆘 Troubleshooting v2.0

### Problemas Comuns

1. **Erro de conexão MySQL**
   - Verificar credenciais no .env
   - Confirmar se MySQL está rodando: `sudo systemctl status mysql`

2. **Erro na migração v2.0**
   - Executar: `npm run init-db` primeiro
   - Depois: `npm run migrate-v2`
   - Verificar logs: `pm2 logs facebook-ads-organizer`

3. **Frontend não carrega novas abas**
   - Confirmar se arquivo index.html foi atualizado
   - Limpar cache do navegador
   - Verificar console do navegador para erros

4. **APIs Google Ads não funcionam**
   - Verificar se tabela google_ads foi criada
   - Confirmar se rotas estão registradas no server.js
   - Testar endpoint: `GET /api/health`

### Logs

- **PM2**: `pm2 logs`
- **Nginx**: `/var/log/nginx/error.log`
- **MySQL**: `/var/log/mysql/error.log`

### Verificar Migração v2.0

```sql
-- Verificar se tabelas v2.0 existem
SHOW TABLES LIKE 'google_ads';
SHOW TABLES LIKE 'socios';
DESCRIBE pagamentos; -- Deve ter coluna 'plataforma'
```

## 📈 Melhorias Futuras v3.0

- [ ] Integração direta com APIs do Meta e Google
- [ ] Dashboard com gráficos (Chart.js)
- [ ] Notificações por email/webhook
- [ ] Relatórios PDF avançados
- [ ] Multi-tenancy (múltiplas empresas)
- [ ] Cache com Redis
- [ ] Webhooks para sincronização automática

## 🔄 Migração v1.0 → v2.0

O sistema detecta automaticamente dados da v1.0 e executa a migração:

1. **Dados existentes preservados** - Todos os pagamentos Meta continuam funcionando
2. **Novas tabelas criadas** - google_ads e socios
3. **Coluna plataforma adicionada** - Diferencia Meta de Google
4. **Interface atualizada** - Sistema de abas com todas as funcionalidades
5. **APIs expandidas** - Novos endpoints mantendo compatibilidade

## 👨‍💻 Desenvolvido por

**Renato Stelar & Vinicius Code**
Sistema de gestão multi-plataforma para Facebook Ads e Google Ads

---

## 📄 Licença

ISC License - Uso interno

---

**🎉 Facebook Ads Organizer v2.0** - Gestão completa e profissional para suas campanhas digitais!