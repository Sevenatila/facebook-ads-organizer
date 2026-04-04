#!/bin/bash

echo "🔧 Configurando VPS para Facebook Ads Organizer..."

# Atualizar sistema
echo "🔄 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versões
echo "✅ Versões instaladas:"
node --version
npm --version

# Instalar MySQL
echo "🗃️ Instalando MySQL..."
sudo apt install -y mysql-server

# Configurar MySQL (básico)
echo "⚙️ Configurando MySQL..."
sudo mysql_secure_installation

# Instalar PM2 globalmente
echo "🚀 Instalando PM2..."
sudo npm install -g pm2

# Instalar Git se não estiver instalado
echo "📁 Verificando Git..."
if ! command -v git &> /dev/null; then
    echo "Instalando Git..."
    sudo apt install -y git
fi

# Criar usuário para aplicação (opcional)
echo "👤 Criando usuário da aplicação..."
sudo adduser --disabled-password --gecos "" fbads

echo "🎯 Próximos passos:"
echo "1. Clone o repositório: git clone <seu-repo>"
echo "2. Navegue até a pasta: cd facebook-ads-organizer"
echo "3. Configure o .env com suas credenciais MySQL"
echo "4. Execute: chmod +x deploy.sh && ./deploy.sh"

echo "✅ VPS configurada com sucesso!"