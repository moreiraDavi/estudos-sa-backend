# Estudos SA — Backend 🧠📚

Este é o backend da aplicação **Estudos SA**, um projeto acadêmico desenvolvido para gerar rotinas de estudo personalizadas para concursos públicos, com auxílio de inteligência artificial (Hugging Face API).

## 🔧 Tecnologias Utilizadas

- **Node.js** com **Express.js**
- **Prisma ORM** com **MongoDB Atlas**
- **Hugging Face Inference API**
- **JWT** para autenticação
- **Axios** para chamadas externas
- **Bcrypt** pra encriptação de senhas

---

## 📁 Estrutura do Projeto

```
.
├── config/         # Configuração da API do Hugging Face
├── middlewares/    # Middlewares Express (ex: verificação de token)
├── prisma/         # Definição do schema do banco de dados
├── routes/         # Rotas da API (preferência, rotina, usuários, etc)
├── services/       # Lógica de negócio / integração externa
├── utils/          # Funções auxiliares
├── server.js       # Ponto de entrada do servidor
```

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/moreiraDavi/estudos-sa-backend.git
cd estudos-sa-teste
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
DATABASE_URL="sua_string_do_mongodb"
HF_API_TOKEN="seu_token_huggingface"
JWT_SECRET="uma_chave_segura"
HF_MODEL=meta-llama/Llama-3.3-70B-Instruct(modelo utilizado nos testes)
```

4. **Execute as migrações do banco (se necessário):**

```bash
npx prisma generate
npx prisma db push
```

5. **Inicie o servidor:**

```bash
npm start
```

---

## 📌 Funcionalidades

- Criar e listar preferências de estudo
- Gerar rotinas semanais com IA (via Hugging Face)
- CRUD completo de preferências
- Integração com autenticação por token (JWT)

---

## 📬 Contato

Caso queira me contatar ou dar feedback:

- LinkedIn:www.linkedin.com/in/davi-moreira-631974289
- Email: moreiradavi160@gmail.com

---

## 🧪 Em Desenvolvimento

Este projeto está em constante evolução e novas funcionalidades serão adicionadas, como:

- Sistema de progresso semanal
- Painel de administração
- Interface gráfica integrada

---

## 📄 Licença

Este projeto é de uso pessoal para fins acadêmicos. Sinta-se livre para estudar e utilizar como base.
