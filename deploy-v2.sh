#!/bin/bash

echo "🚀 Iniciando deploy do Facebook Ads Organizer v2.0..."

# Verificar se está em produção
if [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Modo produção detectado"
else
    echo "🧪 Modo desenvolvimento/teste"
fi

# Criar diretório de logs se não existir
mkdir -p logs

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# Verificar se PM2 está instalado globalmente
if ! command -v pm2 &> /dev/null; then
    echo "🔧 Instalando PM2..."
    npm install -g pm2
fi

# Parar processo anterior se existir
echo "⏹️ Parando processo anterior..."
pm2 stop facebook-ads-organizer 2>/dev/null || true
pm2 delete facebook-ads-organizer 2>/dev/null || true

# Configurar banco de dados v1
echo "🗃️ Configurando banco de dados v1..."
node database/init.js

# Executar migração para v2
echo "🔄 Executando migração para v2.0..."
node database/migration-v2.js

# Verificar se migração foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Migração v2.0 concluída com sucesso"
else
    echo "❌ Erro na migração v2.0"
    echo "🔄 Tentando continuar com estrutura existente..."
fi

# Iniciar aplicação
echo "🟢 Iniciando aplicação v2.0..."
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save

# Configurar PM2 para inicializar no boot
pm2 startup

echo "✅ Deploy v2.0 concluído!"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API Health: http://localhost:3000/api/health"
echo "📈 Logs: pm2 logs facebook-ads-organizer"
echo "📊 Status: pm2 status"
echo ""
echo "🆕 Novidades v2.0:"
echo "   - ✅ Suporte ao Google Ads"
echo "   - ✅ Sistema de abas (Meta/Google/Visão/Sócios)"
echo "   - ✅ Gestão de sócios e distribuição"
echo "   - ✅ Dashboard consolidado"
echo "   - ✅ Novos endpoints da API"
echo ""
echo "🔧 Endpoints da API v2.0:"
echo "   - GET /api/pagamentos (Meta/Facebook)"
echo "   - GET /api/google-ads (Google Ads)"
echo "   - GET /api/socios (Gestão de sócios)"
echo "   - GET /api/google-ads/consolidado (Dados unificados)"