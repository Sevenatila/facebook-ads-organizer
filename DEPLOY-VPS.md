# 🚀 Deploy na VPS Hostinger - Facebook Ads Organizer

## ✅ PASSO A PASSO COMPLETO

### 1️⃣ **Acessar sua VPS Hostinger**

```bash
# Conectar via SSH (substitua pelo seu IP e usuário)
ssh root@SEU_IP_DA_VPS
# ou
ssh usuario@SEU_IP_DA_VPS
```

### 2️⃣ **Executar o Setup Automático**

```bash
# Baixar e executar script de instalação
wget https://raw.githubusercontent.com/Sevenatila/facebook-ads-organizer/master/install-vps.sh
chmod +x install-vps.sh
sudo ./install-vps.sh
```

**O que esse script faz:**
- ✅ Atualiza o sistema Ubuntu/Debian
- ✅ Instala Node.js 18.x
- ✅ Instala MySQL 8.0
- ✅ Configura MySQL com segurança
- ✅ Instala PM2 para gerenciar processos
- ✅ Instala Git

### 3️⃣ **Clonar o Projeto**

```bash
# Clonar repositório
git clone https://github.com/Sevenatila/facebook-ads-organizer.git
cd facebook-ads-organizer

# Verificar arquivos
ls -la
```

### 4️⃣ **Configurar Banco de Dados**

```bash
# Acessar MySQL
sudo mysql -u root -p

# Criar banco e usuário (execute um por vez)
CREATE DATABASE facebook_ads_organizer;
CREATE USER 'fbads'@'localhost' IDENTIFIED BY 'SuaSenhaForte123!';
GRANT ALL PRIVILEGES ON facebook_ads_organizer.* TO 'fbads'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5️⃣ **Configurar Ambiente**

```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar configurações
nano .env
```

**Configure o .env assim:**
```bash
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=fbads
DB_PASSWORD=SuaSenhaForte123!
DB_NAME=facebook_ads_organizer
DB_PORT=3306

# Configurações do Servidor
PORT=3000
NODE_ENV=production

# Configurações de Segurança
JWT_SECRET=facebook_ads_organizer_secret_key_2024_vps
```

### 6️⃣ **Deploy Automático**

```bash
# Executar deploy
chmod +x deploy.sh
./deploy.sh
```

**O que esse script faz:**
- ✅ Instala dependências do Node.js
- ✅ Instala PM2 se necessário
- ✅ Para processos anteriores
- ✅ Inicializa o banco de dados
- ✅ Inicia a aplicação com PM2
- ✅ Configura para iniciar automaticamente

### 7️⃣ **Verificar se Está Funcionando**

```bash
# Ver logs
pm2 logs facebook-ads-organizer

# Ver status
pm2 status

# Testar conexão
curl http://localhost:3000/api/health
```

### 8️⃣ **Configurar Nginx (Opcional - Recomendado)**

```bash
# Instalar Nginx
sudo apt install nginx -y

# Criar configuração
sudo nano /etc/nginx/sites-available/facebook-ads
```

**Cole esta configuração:**
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com;  # ou IP da VPS

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/facebook-ads /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx
```

### 9️⃣ **Acessar sua Aplicação**

**Sem Nginx:**
```
http://SEU_IP_DA_VPS:3000
```

**Com Nginx:**
```
http://SEU_IP_DA_VPS
http://SEU_DOMINIO.com  (se configurou domínio)
```

---

## 🔧 **COMANDOS ÚTEIS**

### Gerenciar Aplicação
```bash
# Ver logs em tempo real
pm2 logs facebook-ads-organizer --lines 50

# Restart
pm2 restart facebook-ads-organizer

# Status
pm2 status

# Monitoramento
pm2 monit

# Parar
pm2 stop facebook-ads-organizer
```

### Backup do Banco
```bash
# Backup
mysqldump -u fbads -p facebook_ads_organizer > backup-$(date +%Y%m%d).sql

# Restore
mysql -u fbads -p facebook_ads_organizer < backup-20240404.sql
```

### Atualizar Código
```bash
cd facebook-ads-organizer
git pull origin master
npm install --production
pm2 restart facebook-ads-organizer
```

---

## 🛡️ **SEGURANÇA ADICIONAL**

### Firewall (Opcional)
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # se não usar Nginx
```

### SSL com Certbot (Opcional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d SEU_DOMINIO.com
```

---

## ❗ **PROBLEMAS COMUNS**

### 1. Erro de Conexão MySQL
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql
sudo systemctl start mysql

# Verificar logs
sudo tail -f /var/log/mysql/error.log
```

### 2. Aplicação não inicia
```bash
# Ver logs detalhados
pm2 logs facebook-ads-organizer

# Verificar porta
netstat -tlnp | grep 3000
```

### 3. Permissões
```bash
# Corrigir permissões
sudo chown -R $USER:$USER /home/$USER/facebook-ads-organizer
```

---

## 🎯 **URLs IMPORTANTES**

- **GitHub:** https://github.com/Sevenatila/facebook-ads-organizer
- **Dashboard:** http://SEU_IP:3000
- **API Health:** http://SEU_IP:3000/api/health
- **Logs PM2:** `pm2 logs facebook-ads-organizer`

---

## 📞 **SUPORTE**

Se algo der errado:

1. Verificar logs: `pm2 logs facebook-ads-organizer`
2. Verificar MySQL: `sudo systemctl status mysql`
3. Verificar configurações: `cat .env`
4. Reiniciar tudo: `pm2 restart facebook-ads-organizer`

**Seu projeto está pronto! 🎉**