# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-04-05

### 🎉 MAJOR RELEASE - Sistema Multi-Plataforma

### Added
- ✅ **Suporte completo ao Google Ads**
  - Novo model `GoogleAds.js` com métodos completos
  - Rotas API `/api/google-ads/*` com CRUD completo
  - Parser inteligente para dados do Google
  - Tipos de campanha (Search, Display, Shopping, etc.)

- ✅ **Sistema de Gestão de Sócios**
  - Novo model `Socio.js` para gestão societária
  - Rotas API `/api/socios/*` com funcionalidades completas
  - Cálculo automático de distribuição de lucros
  - Controle de percentuais e validação (máx 100%)
  - Ativar/desativar sócios

- ✅ **Interface com Sistema de Abas**
  - 4 abas distintas: Meta, Google Ads, Visão Geral, Sócios
  - Sistema de navegação moderno e responsivo
  - Transições suaves entre seções
  - Estado ativo visual claro

- ✅ **Dashboard Consolidado (Visão Geral)**
  - Dados unificados Meta + Google Ads
  - Toggles para filtrar por plataforma
  - Botões "Expandir/Colapsar Todos"
  - Métricas consolidadas e comparativas

- ✅ **Novos Endpoints da API**
  - `GET /api/google-ads/consolidado` - Dados unificados
  - `POST /api/socios/distribuicao` - Cálculo de distribuição
  - `GET /api/socios/percentual/total` - Status dos percentuais
  - `GET /api/google-ads/tipos` - Tipos de campanha
  - `GET /api/google-ads/contas` - Contas Google específicas

### Changed
- 📊 **Título atualizado**: "Contas Pagas" → "Gerenciar Contas"
- 🗄️ **Estrutura do banco expandida**:
  - Nova tabela `google_ads` para campanhas Google
  - Nova tabela `socios` para gestão societária
  - Coluna `plataforma` adicionada em `pagamentos`
- 📦 **Version bump**: 1.0.0 → 2.0.0
- 🔧 **Server.js atualizado** com novas rotas
- 📋 **Package.json** com script `migrate-v2`

### Enhanced
- ⚡ **Performance melhorada** com queries otimizadas
- 🔒 **Segurança mantida** - Mesmas validações de email
- 💾 **Persistência expandida** - Múltiplas fontes de dados
- 🎨 **UI/UX aprimorado** - Interface mais intuitiva

### Files Added
- `models/GoogleAds.js` - Model para campanhas Google Ads
- `models/Socio.js` - Model para gestão de sócios
- `routes/google-ads.js` - Rotas API Google Ads
- `routes/socios.js` - Rotas API sócios
- `database/migration-v2.js` - Script de migração v2.0
- `deploy-v2.sh` - Script de deploy atualizado
- `test-local-v2.js` - Servidor de teste com dados mock
- `README-v2.md` - Documentação atualizada
- `CHANGELOG.md` - Este arquivo

### Files Modified
- `public/index.html` - Interface completamente renovada (983 → 1.941 linhas)
- `server.js` - Novas rotas registradas
- `package.json` - Version 2.0.0 e novo script

### Files Backed Up
- `public/index-backup-v1.html` - Backup da versão anterior

### Database Changes
```sql
-- Nova tabela para Google Ads
CREATE TABLE google_ads (
    id VARCHAR(50) PRIMARY KEY,
    conta_nome VARCHAR(500) NOT NULL,
    conta_id VARCHAR(100),
    data_pagamento DATE NOT NULL,
    data_key VARCHAR(20) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    tipo_campanha VARCHAR(100) DEFAULT 'Search',
    plataforma VARCHAR(20) DEFAULT 'Google',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nova tabela para sócios
CREATE TABLE socios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    percentual DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    data_entrada DATE,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nova coluna para identificar plataforma
ALTER TABLE pagamentos ADD COLUMN plataforma VARCHAR(20) DEFAULT 'Meta';
```

### Testing
- ✅ Sistema de teste local implementado (`test-local-v2.js`)
- ✅ Dados mock para todas as funcionalidades
- ✅ APIs testadas e funcionando
- ✅ Interface testada em desenvolvimento

### Migration Guide
1. **Backup automático**: Sistema preserva dados da v1.0
2. **Execução**: `npm run migrate-v2` após `npm run init-db`
3. **Compatibilidade**: 100% compatível com dados existentes
4. **Rollback**: Possível via backup de banco de dados

### Breaking Changes
- **Nenhuma** - Sistema mantém compatibilidade total com v1.0

### Known Issues
- Migração requer MySQL ativo (configuração de VPS)
- Cache do navegador pode precisar ser limpo para novas funcionalidades

## [1.0.0] - 2024-04-04

### Added
- ✅ Sistema inicial de Facebook Ads
- ✅ Dashboard com tema escuro
- ✅ API REST básica
- ✅ Autenticação por email
- ✅ Export CSV
- ✅ Deploy automatizado