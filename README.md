
# Projeto SaaS - Cardápio e Taplist para Cervejaria

## ✔️ Deploy automático no Railway

Este projeto foi ajustado para:
- Criar automaticamente as tabelas no banco via Drizzle ORM (`npx drizzle-kit push`)
- Criar um usuário `admin` com senha `admin123` no primeiro start (via `seed.ts`)

## 🚀 Requisitos no Railway
1. Banco PostgreSQL provisionado
2. Variável `DATABASE_URL` definida com a string de conexão
3. Apenas faça o deploy do `.zip` e tudo será criado automaticamente!

## 👤 Login inicial
- Usuário: `admin`
- Senha: `admin123`
