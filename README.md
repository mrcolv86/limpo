# BierServ - Sistema de Gerenciamento de Cervejaria

Sistema completo de gerenciamento para cervejarias com cardápio digital, gestão de mesas, pedidos em tempo real e relatórios avançados.

## 🚀 Deploy no Railway.com

### Pré-requisitos
- Conta no [Railway.com](https://railway.app/)
- Conta no GitHub (para conectar o repositório)

### Passo a Passo para Deploy

1. **Conectar o Repositório**
   - Acesse [Railway.com](https://railway.app/) e faça login
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte este repositório

2. **Configurar Banco de Dados PostgreSQL**
   - No dashboard do projeto, clique em "Add Service"
   - Selecione "Database" → "PostgreSQL"
   - O Railway criará automaticamente a variável `DATABASE_URL`

3. **Configurar Variáveis de Ambiente**
   No painel de "Variables", adicione:
   ```
   NODE_ENV=production
   ```

4. **Deploy Automático**
   - O Railway detectará automaticamente os arquivos `railway.toml` e `Dockerfile`
   - O build será executado automaticamente
   - A aplicação estará disponível na URL fornecida pelo Railway

### Funcionalidades Principais

✅ **Sistema de Usuários Completo**
- Gerenciamento de usuários com diferentes roles (Admin, Gerente, Garçom, Cozinha)
- Sistema de autenticação seguro
- Controle de acesso baseado em permissões

✅ **Cardápio Digital Inteligente**
- Criação e edição de produtos e categorias
- Upload de imagens com visualização
- Filtros por ABV, IBU e categorias
- Exportação para PDF com logotipo

✅ **Gestão de Mesas e Pedidos**
- QR Codes únicos para cada mesa
- Pedidos em tempo real via WebSocket
- Status automático das mesas
- Notificações instantâneas

✅ **Relatórios Avançados**
- Vendas por hora, categoria e produto
- Exportação de relatórios em PDF
- Dashboards com métricas em tempo real

✅ **Sistema Multilíngue**
- Suporte completo para Português, Inglês e Espanhol
- Interface traduzida integralmente
- Configuração de idioma por usuário

### Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, Tailwind CSS, Vite
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Tempo Real**: WebSocket (Socket.io)
- **Autenticação**: Passport.js
- **Internacionalização**: i18next

### Configurações de Produção

O projeto já está otimizado para produção com:
- Build automático do frontend
- Compressão de assets
- Configuração de CORS
- Gerenciamento de sessões
- Logs estruturados
- Health checks

### Suporte e Documentação

Para suporte técnico ou dúvidas sobre implementação, consulte a documentação completa ou entre em contato.

---

**BierServ** - Transformando a gestão de cervejarias através da tecnologia 🍺