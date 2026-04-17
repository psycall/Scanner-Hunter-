# 📚 API Reference - Arc Pay Platform

> **Documentação Completa de Endpoints tRPC**

---

## 🔗 Base URL

```
Development: http://localhost:3000/api/trpc
Production: https://seu-dominio.com/api/trpc
```

---

## 🔐 Autenticação

### OAuth Flow

```
1. Frontend: Redireciona para /api/oauth/callback?returnPath=/dashboard
2. Backend: Valida token OAuth
3. Response: Set-Cookie com sessão
4. Frontend: Acessa protectedProcedure com contexto.user
```

### Headers Necessários

```http
Cookie: manus_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 📋 Procedures Disponíveis

### 1️⃣ Auth Router

#### `auth.me` (GET)

Obter usuário autenticado

```typescript
// Request
trpc.auth.me.useQuery()

// Response
{
  id: 1,
  openId: "user-123",
  name: "João Silva",
  email: "joao@example.com",
  role: "user",
  createdAt: "2026-04-17T00:00:00Z"
}
```

#### `auth.logout` (POST)

Fazer logout

```typescript
// Request
trpc.auth.logout.useMutation()

// Response
{
  success: true
}
```

---

### 2️⃣ Wallets Router

#### `wallets.list` (GET)

Listar carteiras do usuário

```typescript
// Request
trpc.wallets.list.useQuery()

// Response
[
  {
    id: 1,
    userId: 1,
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
    isDefault: true
  }
]
```

#### `wallets.create` (POST)

Criar nova carteira

```typescript
// Request
trpc.wallets.create.useMutation({
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  isDefault: false
})

// Response
{
  id: 2,
  userId: 1,
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  isDefault: false
}
```

#### `wallets.setDefault` (POST)

Definir carteira padrão

```typescript
// Request
trpc.wallets.setDefault.useMutation({
  walletId: 1
})

// Response
{
  success: true
}
```

#### `wallets.getDefault` (GET)

Obter carteira padrão

```typescript
// Request
trpc.wallets.getDefault.useQuery()

// Response
{
  id: 1,
  userId: 1,
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  isDefault: true
}
```

---

### 3️⃣ Payment Links Router

#### `paymentLinks.create` (POST)

Criar novo link de pagamento

```typescript
// Request
trpc.paymentLinks.create.useMutation({
  amount: "100.50",
  description: "Pagamento de serviços",
  expiresIn: 7 // dias
})

// Response
{
  id: 1,
  slug: "abc123xyz",
  amount: "100.50",
  description: "Pagamento de serviços",
  status: "active",
  url: "https://arcpay.com/pay/abc123xyz",
  qrCode: "data:image/svg+xml;base64,..."
}
```

#### `paymentLinks.list` (GET)

Listar links do usuário

```typescript
// Request
trpc.paymentLinks.list.useQuery()

// Response
[
  {
    id: 1,
    slug: "abc123xyz",
    amount: "100.50",
    description: "Pagamento de serviços",
    status: "active",
    createdAt: "2026-04-17T00:00:00Z"
  }
]
```

#### `paymentLinks.getBySlug` (GET)

Obter link público

```typescript
// Request
trpc.paymentLinks.getBySlug.useQuery({
  slug: "abc123xyz"
})

// Response
{
  id: 1,
  slug: "abc123xyz",
  amount: "100.50",
  description: "Pagamento de serviços",
  status: "active",
  creatorName: "João Silva"
}
```

#### `paymentLinks.cancel` (POST)

Cancelar link

```typescript
// Request
trpc.paymentLinks.cancel.useMutation({
  linkId: 1
})

// Response
{
  success: true,
  status: "cancelled"
}
```

---

### 4️⃣ Transactions Router

#### `transactions.list` (GET)

Listar transações do usuário

```typescript
// Request
trpc.transactions.list.useQuery({
  status: "confirmed" // opcional
})

// Response
[
  {
    id: 1,
    paymentLinkId: 1,
    amount: "100.50",
    status: "confirmed",
    txHash: "0x1234567890abcdef...",
    fromAddress: "0x742d35Cc...",
    toAddress: "0x987654321...",
    createdAt: "2026-04-17T10:30:00Z"
  }
]
```

#### `transactions.getByTxHash` (GET)

Obter transação por hash

```typescript
// Request
trpc.transactions.getByTxHash.useQuery({
  txHash: "0x1234567890abcdef..."
})

// Response
{
  id: 1,
  paymentLinkId: 1,
  amount: "100.50",
  status: "confirmed",
  txHash: "0x1234567890abcdef...",
  fromAddress: "0x742d35Cc...",
  toAddress: "0x987654321...",
  createdAt: "2026-04-17T10:30:00Z"
}
```

#### `transactions.confirm` (POST)

Confirmar transação on-chain

```typescript
// Request
trpc.transactions.confirm.useMutation({
  txHash: "0x1234567890abcdef...",
  amount: "100.50"
})

// Response
{
  id: 1,
  status: "confirmed",
  confirmationTime: "2026-04-17T10:35:00Z"
}
```

---

### 5️⃣ Admin Router

#### `admin.getAllUsers` (GET) - Admin Only

Listar todos os usuários

```typescript
// Request (requer role: 'admin')
trpc.admin.getAllUsers.useQuery()

// Response
[
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    role: "user",
    createdAt: "2026-04-17T00:00:00Z",
    lastSignedIn: "2026-04-17T10:00:00Z"
  }
]
```

#### `admin.getAllTransactions` (GET) - Admin Only

Listar todas as transações

```typescript
// Request
trpc.admin.getAllTransactions.useQuery()

// Response
[
  {
    id: 1,
    userId: 1,
    userName: "João Silva",
    amount: "100.50",
    status: "confirmed",
    createdAt: "2026-04-17T10:30:00Z"
  }
]
```

#### `admin.getStats` (GET) - Admin Only

Obter estatísticas

```typescript
// Request
trpc.admin.getStats.useQuery()

// Response
{
  totalUsers: 150,
  totalTransactions: 1250,
  totalVolume: "125000.00",
  activeLinks: 45,
  confirmedTransactions: 1200,
  pendingTransactions: 50
}
```

---

## 🔄 Fluxos Comuns

### Fluxo 1: Criar e Compartilhar Link

```typescript
// 1. Criar link
const link = await trpc.paymentLinks.create.mutate({
  amount: "100.00",
  description: "Pagamento de fatura"
});

// 2. Gerar QR Code (automático)
// 3. Compartilhar URL
const shareUrl = `https://arcpay.com/pay/${link.slug}`;

// 4. Copiar para clipboard
navigator.clipboard.writeText(shareUrl);
```

### Fluxo 2: Processar Pagamento

```typescript
// 1. Conectar wallet com Wagmi
const { connect } = useConnect();
await connect({ connector: injectedConnector });

// 2. Obter link
const link = await trpc.paymentLinks.getBySlug.query({
  slug: "abc123xyz"
});

// 3. Enviar transação
const txHash = await sendTransaction({
  to: link.creatorWallet,
  value: parseUnits(link.amount, 6),
  token: USDC_ADDRESS
});

// 4. Confirmar no backend
await trpc.transactions.confirm.mutate({
  txHash,
  amount: link.amount
});
```

### Fluxo 3: Verificar Status

```typescript
// 1. Listar transações
const transactions = await trpc.transactions.list.query();

// 2. Filtrar por status
const confirmed = transactions.filter(t => t.status === 'confirmed');
const pending = transactions.filter(t => t.status === 'pending');

// 3. Monitorar em tempo real
setInterval(async () => {
  const updated = await trpc.transactions.list.query();
  // Atualizar UI
}, 5000);
```

---

## ⚠️ Códigos de Erro

| Código | Mensagem | Solução |
|--------|----------|---------|
| `UNAUTHORIZED` | Não autenticado | Fazer login |
| `FORBIDDEN` | Sem permissão | Verificar role |
| `NOT_FOUND` | Recurso não existe | Verificar ID |
| `BAD_REQUEST` | Dados inválidos | Validar input |
| `INTERNAL_SERVER_ERROR` | Erro do servidor | Contatar suporte |

---

## 🧪 Exemplos de Teste

### cURL

```bash
# Listar carteiras
curl -X POST http://localhost:3000/api/trpc/wallets.list \
  -H "Content-Type: application/json" \
  -H "Cookie: manus_session=..." \
  -d '{}'

# Criar link
curl -X POST http://localhost:3000/api/trpc/paymentLinks.create \
  -H "Content-Type: application/json" \
  -H "Cookie: manus_session=..." \
  -d '{
    "amount": "100.50",
    "description": "Teste"
  }'
```

### JavaScript/TypeScript

```typescript
import { trpc } from '@/lib/trpc';

// Criar link
const link = await trpc.paymentLinks.create.mutate({
  amount: "100.50",
  description: "Teste"
});

console.log('Link criado:', link);
```

### React Hook

```typescript
function MyComponent() {
  const { data: wallets, isLoading } = trpc.wallets.list.useQuery();
  const createLink = trpc.paymentLinks.create.useMutation();

  const handleCreate = async () => {
    const link = await createLink.mutateAsync({
      amount: "100.50",
      description: "Teste"
    });
    console.log('Link:', link);
  };

  return (
    <div>
      {isLoading ? 'Carregando...' : (
        <div>
          {wallets?.map(w => (
            <div key={w.id}>{w.address}</div>
          ))}
          <button onClick={handleCreate}>Criar Link</button>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Rate Limiting

```
- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário
- Limite de 10MB por requisição
```

---

## 🔒 Segurança

- ✅ HTTPS obrigatório em produção
- ✅ CORS configurado
- ✅ CSRF protection ativo
- ✅ Rate limiting aplicado
- ✅ Input validation com Zod
- ✅ SQL injection prevention (Drizzle ORM)

---

## 📞 Suporte

- 📧 dev@scannerhunterpro.com
- 🐛 Issues: https://github.com/psycall/Scanner-Hunter-/issues
- 📚 Docs: https://github.com/psycall/Scanner-Hunter-/wiki

---

**Versão:** 1.0.0  
**Última Atualização:** 17 de Abril de 2026  
**Status:** ✅ Completo e Testado
