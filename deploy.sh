#!/bin/bash

echo "🚀 Iniciando deploy do Facebook Ads Organizer..."

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

# Configurar banco de dados
echo "🗃️ Configurando banco de dados..."
node database/init.js

# Iniciar aplicação
echo "🟢 Iniciando aplicação..."
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save

# Configurar PM2 para inicializar no boot
pm2 startup

echo "✅ Deploy concluído!"
echo "📊 Dashboard: http://localhost:3000"
echo "📈 Logs: pm2 logs facebook-ads-organizer"
echo "📊 Status: pm2 status"