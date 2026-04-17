# 🚀 Guia de Deployment - Vercel

> **Deploy Arc Pay em 5 Minutos na Vercel**

---

## ✅ Pré-requisitos

- [x] Conta GitHub com repositório
- [x] Conta Vercel (gratuita)
- [x] Banco de dados MySQL (TiDB Cloud recomendado)
- [x] Variáveis de ambiente preparadas

---

## 📋 Passo 1: Preparar Variáveis de Ambiente

### Coletar Informações Necessárias

```bash
# 1. DATABASE_URL (MySQL)
# Formato: mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}

# 2. VITE_APP_ID
# Obter em: https://manus.im/dashboard

# 3. JWT_SECRET
# Gerar: openssl rand -base64 32

# 4. Outras variáveis
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
VITE_APP_TITLE=Arc Pay Platform
VITE_APP_LOGO=https://seu-cdn.com/logo.png
```

---

## 🔗 Passo 2: Conectar GitHub à Vercel

### 2.1 Acessar Vercel

1. Vá para [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. Clique em **"New Project"**
2. Selecione **"Import Git Repository"**
3. Procure por **"Scanner-Hunter-"**
4. Clique em **"Import"**

---

## ⚙️ Passo 3: Configurar Projeto

### 3.1 Detalhes do Projeto

```
Project Name: arc-pay-platform
Framework Preset: Other
Root Directory: ./
```

### 3.2 Build & Development Settings

```
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

### 3.3 Environment Variables

Clique em **"Environment Variables"** e adicione:

```env
# Database
DATABASE_URL=mysql://user:pass@host:port/db?ssl={"rejectUnauthorized":true}

# Auth
VITE_APP_ID=seu_app_id
JWT_SECRET=seu_jwt_secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# App Config
VITE_APP_TITLE=Arc Pay Platform
VITE_APP_LOGO=https://seu-cdn.com/logo.png
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# Forge API
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
BUILT_IN_FORGE_API_KEY=sua_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_key

# Owner
OWNER_NAME=seu_nome
OWNER_OPEN_ID=seu_open_id
```

---

## 🚀 Passo 4: Deploy

### 4.1 Iniciar Deploy

1. Clique em **"Deploy"**
2. Aguarde a compilação (2-3 minutos)
3. Veja o progresso em tempo real

### 4.2 Verificar Deploy

```
✅ Build: Sucesso
✅ Tests: Passaram
✅ Preview: https://arc-pay-platform.vercel.app
✅ Production: https://seu-dominio.com
```

---

## 🔍 Passo 5: Verificar Funcionamento

### 5.1 Testar Landing Page

```bash
curl https://seu-dominio.com
# Deve retornar HTML da landing page
```

### 5.2 Testar API

```bash
curl https://seu-dominio.com/api/trpc/auth.me
# Deve retornar resposta tRPC
```

### 5.3 Testar no Navegador

1. Abra https://seu-dominio.com
2. Clique em **"Entrar"**
3. Faça login com OAuth
4. Verifique o dashboard

---

## 🎯 Passo 6: Configurar Domínio Customizado

### 6.1 No Painel Vercel

1. Vá para **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio: `arcpay.com`

### 6.2 Configurar DNS

Adicione registros DNS no seu provedor:

```dns
CNAME: arcpay.com → cname.vercel-dns.com
```

### 6.3 Verificar

```bash
nslookup arcpay.com
# Deve apontar para Vercel
```

---

## 🔒 Passo 7: Configurar SSL/TLS

### 7.1 Certificado Automático

- Vercel gera automaticamente certificado Let's Encrypt
- Válido por 90 dias (renovação automática)

### 7.2 Verificar HTTPS

```bash
curl -I https://seu-dominio.com
# Deve mostrar: HTTP/2 200
```

---

## 📊 Passo 8: Monitorar Performance

### 8.1 Analytics

1. Vá para **"Analytics"** no painel Vercel
2. Veja métricas:
   - Requisições por segundo
   - Tempo de resposta
   - Taxa de erro

### 8.2 Logs

```bash
# Ver logs em tempo real
vercel logs --follow

# Filtrar por erro
vercel logs --error
```

---

## 🐛 Troubleshooting

### Problema: Build falha

```bash
# Solução 1: Limpar cache
vercel env pull .env.local
pnpm install
pnpm build

# Solução 2: Verificar logs
vercel logs --follow
```

### Problema: Banco de dados não conecta

```bash
# Verificar conexão
mysql -h host -u user -p -e "SELECT 1;"

# Verificar URL
echo $DATABASE_URL
```

### Problema: OAuth não funciona

```bash
# Verificar variáveis
vercel env list

# Atualizar variáveis
vercel env add VITE_APP_ID seu_novo_id
```

---

## 🔄 Passo 9: Configurar CI/CD

### 9.1 Deploy Automático

Vercel faz deploy automático a cada push:

```bash
git push origin main
# → Vercel detecta mudança
# → Inicia build automático
# → Deploy em 2-3 minutos
```

### 9.2 Preview Deployments

Cada Pull Request gera preview:

```
PR #1 → https://arc-pay-platform-pr-1.vercel.app
PR #2 → https://arc-pay-platform-pr-2.vercel.app
```

---

## 📈 Passo 10: Otimizações

### 10.1 Edge Functions

```typescript
// vercel/functions/api/health.ts
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}
```

### 10.2 Caching

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "max-age=3600" }
      ]
    }
  ]
}
```

### 10.3 Rate Limiting

```typescript
// Implementar no Express
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados MySQL criado
- [ ] GitHub conectado à Vercel
- [ ] Deploy realizado com sucesso
- [ ] Landing page acessível
- [ ] Login OAuth funcionando
- [ ] Dashboard carregando
- [ ] Domínio customizado configurado
- [ ] SSL/TLS ativo
- [ ] Logs monitorados

---

## 📞 Suporte

- 📧 Vercel Support: support@vercel.com
- 🐛 Issues: https://github.com/psycall/Scanner-Hunter-/issues
- 📚 Docs: https://vercel.com/docs

---

**Status:** ✅ Pronto para Produção  
**Tempo de Deploy:** 5 minutos  
**Custo:** Gratuito (até 100GB/mês)
