# Facebook Ads Organizer

Sistema de organização e controle de contas pagas do Facebook Ads com dashboard interativo.

## 🚀 Características

- ✅ **Dashboard moderno** com tema escuro profissional
- ✅ **API REST completa** com Node.js + Express
- ✅ **Banco de dados MySQL** para persistência
- ✅ **Filtros avançados** por período, empresa e contas
- ✅ **Parser inteligente** de texto do Facebook
- ✅ **Export CSV** completo
- ✅ **Migração automática** do localStorage
- ✅ **Deploy automatizado** com PM2

## 🔧 Tecnologias

- **Backend**: Node.js, Express.js
- **Banco**: MySQL 8.x
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Deploy**: PM2, Linux VPS
- **Segurança**: Helmet, CORS, dotenv

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

### 4. Inicializar Banco

```bash
npm run init-db
```

### 5. Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
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

### 3. Deploy da Aplicação

```bash
# Clonar projeto
git clone <seu-repositorio>
cd facebook-ads-organizer

# Configurar .env
cp .env.example .env
nano .env

# Ajustar credenciais:
DB_HOST=localhost
DB_USER=fbads
DB_PASSWORD=senha_forte_aqui
DB_NAME=facebook_ads_organizer
NODE_ENV=production
PORT=3000
```

### 4. Executar Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar reverse proxy
sudo nano /etc/nginx/sites-available/facebook-ads
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

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
```

## 📊 Estrutura da API

### Endpoints

- `GET /api/pagamentos` - Listar pagamentos com filtros
- `POST /api/pagamentos` - Criar novos pagamentos
- `DELETE /api/pagamentos` - Deletar pagamentos
- `GET /api/pagamentos/bms` - Listar Business Managers
- `GET /api/pagamentos/contas` - Listar contas por BM
- `POST /api/migrate` - Migrar dados do localStorage
- `GET /api/health` - Status da API

### Exemplos de Uso

```javascript
// Buscar pagamentos com filtros
GET /api/pagamentos?q=magazzi&bm=BM%20-%20Nome&dataInicio=2024-01-01

// Criar pagamentos
POST /api/pagamentos
{
  "pagamentos": [
    {
      "id": "abc123",
      "bm": "BM - Empresa",
      "contaNome": "Conta Anúncios",
      "contaId": "123456789",
      "date": "15 de janeiro de 2024",
      "dk": "2024-01-15",
      "valor": 1500.00
    }
  ]
}
```

## 🔒 Segurança

- ✅ Headers de segurança com Helmet
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Timeouts de conexão
- ✅ Rate limiting (recomendado)

## 📝 Comandos Úteis

```bash
# Ver logs da aplicação
pm2 logs facebook-ads-organizer

# Restart da aplicação
pm2 restart facebook-ads-organizer

# Status dos processos
pm2 status

# Monitoramento
pm2 monit

# Backup do banco
mysqldump -u fbads -p facebook_ads_organizer > backup.sql

# Restore do banco
mysql -u fbads -p facebook_ads_organizer < backup.sql
```

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão MySQL**
   - Verificar credenciais no .env
   - Confirmar se MySQL está rodando: `sudo systemctl status mysql`

2. **Aplicação não inicia**
   - Verificar logs: `pm2 logs facebook-ads-organizer`
   - Confirmar porta disponível: `netstat -tlnp | grep 3000`

3. **Problemas de permissão**
   - Verificar permissões dos arquivos
   - Executar como usuário correto

### Logs

- **PM2**: `pm2 logs`
- **Nginx**: `/var/log/nginx/error.log`
- **MySQL**: `/var/log/mysql/error.log`

## 📈 Melhorias Futuras

- [ ] Autenticação JWT
- [ ] Backup automático
- [ ] Dashboard de analytics
- [ ] Notificações por email
- [ ] API de relatórios
- [ ] Integração direta com Facebook API

## 👨‍💻 Desenvolvido por

**Renato Stelar**
Sistema de controle de contas pagas do Facebook Ads

---

## 📄 Licença

ISC License - Uso interno