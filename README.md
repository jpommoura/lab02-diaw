---

# 🚗 Sistema de Aluguel de Carros 👨‍💻

> [!NOTE]
> Plataforma web para gestão de aluguéis de automóveis: o cliente solicita e acompanha o pedido pela Internet, e empresas e bancos analisam o pedido financeiramente e executam o contrato.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Projeto do <b>Laboratório 02</b> da disciplina <b>DIAW</b> (Desenvolvimento e Integração de Aplicações Web) do curso de <b>Engenharia de Software da PUC Minas</b>. O sistema permite <i>criar, modificar, consultar e cancelar</i> pedidos de aluguel, com <b>login obrigatório</b>, perfis de <i>cliente</i> e <i>agente</i> (empresa ou banco) e registro opcional de <b>contrato de crédito</b>. Back-end em <b>Spring Boot (MVC)</b>, front-end em <b>React + Vite</b> e banco <b>Supabase (PostgreSQL)</b>.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo do Projeto" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge) ![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.x-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-3.9+-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Agradecimentos](#-agradecimentos)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** _não publicada_
* 📖 **Documentação (UML e histórias de usuário):** [`/docs`](./docs)

---

## 📝 Sobre o Projeto
Locadoras, empresas e bancos precisam controlar pedidos de aluguel de automóveis, a análise financeira do contratante e, quando há financiamento, o contrato de crédito. Este sistema centraliza esse fluxo na Internet:

- O **cliente** se cadastra, informa seus dados (RG, CPF, nome, endereço, profissão e até 3 rendimentos) e cria pedidos de aluguel.
- Os **agentes** (empresas e bancos) analisam o pedido do ponto de vista financeiro; se o parecer for positivo, o pedido segue para a execução do contrato. O banco pode registrar um **contrato de crédito** associado.
- Os automóveis (matrícula, ano, marca, modelo e placa) podem ser propriedade de clientes, empresas ou bancos.

Contexto: trabalho acadêmico (Laboratório 02, 15 pontos), com foco em alinhamento entre modelagem UML e código.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro e login (usuário e senha) com JWT; acesso restrito a usuários cadastrados.
- ⚙️ **CRUD de Cliente:** criar, consultar, atualizar e excluir o próprio cadastro, com até 3 rendimentos.
- 🚘 **Automóveis:** cadastro e listagem, com tipo de proprietário (cliente, empresa ou banco).
- 📄 **Pedidos de Aluguel:** criar, modificar (enquanto pendente), consultar status e cancelar.
- ✅ **Análise de Pedidos (agentes):** aprovar ou reprovar com parecer financeiro e executar o contrato.
- 🏦 **Contrato de Crédito:** o banco registra o valor de crédito ao aprovar um pedido.

Ciclo de vida do pedido: `PENDENTE → APROVADO → CONTRATADO`, ou `REPROVADO` / `CANCELADO`.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Biblioteca:** React 19
* **Linguagem:** JavaScript (ES6+)
* **Estilização:** CSS
* **Gerenciamento de Estado:** `useState` / `useEffect` (hooks)
* **Build Tool:** Vite 7

### 🖥️ Back-end
* **Linguagem:** Java 25 (JDK)
* **Framework:** Spring Boot 4.0.x (Spring MVC, Spring Security, Bean Validation)
* **Build e dependências:** Apache Maven
* **Banco de Dados:** Supabase (PostgreSQL)
* **ORM:** Hibernate / Spring Data JPA
* **Autenticação:** JWT (jjwt) + Spring Security, senhas com BCrypt

---

## 🏗 Arquitetura

O back-end segue a arquitetura **MVC em camadas**, e o front-end consome a API REST em JSON.

- **Model:** entidades JPA (`Usuario`, `Cliente`, `Rendimento`, `Automovel`, `PedidoAluguel`, `ContratoCredito`).
- **Controller:** endpoints REST (`/api/...`) com autorização por perfil (`@PreAuthorize`).
- **Service:** regras de negócio (transições de status, validações, propriedade do pedido).
- **Repository:** acesso a dados com Spring Data JPA.
- **DTO:** objetos de entrada/saída (`records`) com validação.
- **Security:** filtro JWT sem sessão (stateless) e CORS configurável.

O sistema é subdividido em dois subsistemas: gestão de pedidos e contratos (back-end) e construção dinâmica das páginas web (front-end React).

### Diagramas

Fontes em PlantUML na pasta [`/docs`](./docs):

| Diagrama | Arquivo |
| :---: | :---: |
| **Casos de Uso** | [`docs/casos-de-uso.puml`](./docs/casos-de-uso.puml) |
| **Classes** | [`docs/classes.puml`](./docs/classes.puml) |
| **Pacotes (Visão Lógica)** | [`docs/pacotes.puml`](./docs/pacotes.puml) |
| **Histórias do Usuário** | [`docs/historias-de-usuario.md`](./docs/historias-de-usuario.md) |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Java JDK:** versão **25**
* **Maven:** 3.9 ou superior
* **Node.js:** 20.19 ou superior (necessário para o Vite 7)
* **Conta no Supabase** (projeto PostgreSQL)

---

### 🔑 Variáveis de Ambiente

#### 1 Back-end (Spring Boot)

Copie `backend/.env.example` para `backend/.env` (o arquivo é lido automaticamente e está no `.gitignore`).

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_URL` | URL JDBC do Supabase (Session pooler, porta 5432). | `jdbc:postgresql://aws-0-REGIAO.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DB_USER` | Usuário do banco. | `postgres.SEU_PROJECT_REF` |
| `DB_PASSWORD` | Senha do banco. | `sua_senha` |
| `JWT_SECRET` | Chave de assinatura dos tokens (mínimo 32 caracteres). | `um-segredo-longo-e-aleatorio-...` |
| `CORS_ORIGIN` | Origem permitida do front-end (opcional). | `http://localhost:5173` |

#### 2 Front-end (React, Vite)

Em desenvolvimento não é necessário configurar nada: o Vite redireciona `/api` para `http://localhost:8080`. Para produção, crie `frontend/.env`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API. | `http://localhost:8080/api` |

### 📦 Instalação de Dependências

```bash
git clone <URL_DO_SEU_REPOSITÓRIO>
cd aluguel-carros
```

**Front-end:**
```bash
cd frontend
npm install
cd ..
```

**Back-end:**
```bash
cd backend
mvn clean install
cd ..
```

### 💾 Inicialização do Banco de Dados (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Em *Project Settings → Database*, copie os dados de conexão (**Session pooler**, porta 5432) para o `backend/.env`.
3. O schema é criado automaticamente na primeira execução (Hibernate `ddl-auto=update`). Nenhuma migração manual é necessária.

### ⚡ Como Executar a Aplicação

Em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
🚀 *Disponível em **http://localhost:8080**.*

#### Terminal 2: Front-end (React, Vite)
```bash
cd frontend
npm run dev
```
🎨 *Disponível em **http://localhost:5173**.*

### 🧭 Fluxo de teste

1. Cadastre-se como **Cliente** e preencha *Meu cadastro*.
2. Em *Automóveis*, cadastre um carro e, em *Pedidos*, crie um pedido (status `PENDENTE`).
3. Saia e cadastre-se como **Banco** ou **Empresa**; aprove ou reprove o pedido (o banco pode informar o crédito) e clique em *Executar contrato*.
4. Volte como cliente e confira o status atualizado.

### 📡 Endpoints da API

| Método | Rota | Acesso |
| :--- | :--- | :--- |
| POST | `/api/auth/register`, `/api/auth/login` | público |
| POST / GET / PUT / DELETE | `/api/clientes`, `/api/clientes/me` | cliente |
| GET | `/api/clientes`, `/api/clientes/{id}` | agentes |
| GET / POST | `/api/automoveis` | autenticado |
| POST | `/api/pedidos` | cliente |
| GET | `/api/pedidos`, `/api/pedidos/{id}` | autenticado (cliente vê só os seus) |
| PUT | `/api/pedidos/{id}` | cliente (pendente) / agentes |
| DELETE | `/api/pedidos/{id}` | cliente (cancela) |
| PATCH | `/api/pedidos/{id}/avaliacao`, `/api/pedidos/{id}/contrato` | agentes |

---

## 📂 Estrutura de Pastas

```
.
├── .gitignore                   # 🧹 Ignora .env, node_modules, target, etc.
├── README.md                    # 📘 Documentação principal do projeto.
│
├── /frontend                    # 📁 Aplicação React + Vite
│   ├── .env.example             # 🧩 Variáveis de ambiente do Front-end.
│   ├── index.html
│   ├── vite.config.js           # 🔧 Proxy /api -> :8080.
│   ├── package.json             # 📦 Dependências e scripts.
│   └── /src
│       ├── main.jsx             # 🚪 Ponto de entrada.
│       ├── App.jsx              # 🧭 Layout e navegação por abas.
│       ├── api.js               # 🔌 Chamadas HTTP e sessão (JWT).
│       ├── styles.css           # 🎨 Estilos.
│       └── /pages               # 📄 Auth, Pedidos, Automoveis, Perfil, Clientes.
│
├── /backend                     # 📁 Aplicação Spring Boot
│   ├── .env.example             # 🧩 Variáveis de ambiente do Back-end.
│   ├── pom.xml                  # 🛠️ Build e dependências.
│   └── /src/main
│       ├── /resources           # ⚙️ application.properties
│       └── /java/br/pucminas/aluguel
│           ├── /controller      # 🎮 Endpoints REST.
│           ├── /service         # ⚙️ Regras de negócio.
│           ├── /repository      # 🗄️ Repositórios JPA.
│           ├── /model           # 🧬 Entidades e enums.
│           ├── /dto             # ✉️ Data Transfer Objects.
│           ├── /exception       # 💥 Handler global de erros.
│           └── /security        # 🛡️ JWT e Spring Security.
│
└── /docs                        # 📚 UML (PlantUML) e histórias do usuário.
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Captura de Tela |
| :---: | :---: |
| **Login / Cadastro** | **Meu cadastro (CRUD de cliente)** |
| _adicionar print em `docs/img/login.png`_ | _adicionar print em `docs/img/cadastro.png`_ |
| **Pedidos (cliente)** | **Pedidos (agente: aprovar/reprovar)** |
| _adicionar print em `docs/img/pedidos-cliente.png`_ | _adicionar print em `docs/img/pedidos-agente.png`_ |

### 💻 Exemplo de Saída no Terminal (API)

```bash
curl -X POST 'http://localhost:8080/api/auth/login' \
     -H 'Content-Type: application/json' \
     -d '{"username":"maria","senha":"123456"}'
```

**Saída Esperada:**
```json
{
  "token": "<jwt>",
  "username": "maria",
  "role": "CLIENTE"
}
```

```bash
curl -X GET 'http://localhost:8080/api/pedidos' \
     -H 'Authorization: Bearer <seu-jwt-token>'
```

---

## 🧪 Testes

Testes automatizados ainda não foram implementados. A validação foi feita manualmente seguindo o *Fluxo de teste* descrito acima.

---

## 🔗 Documentações utilizadas

* 📖 **Front-end:** [React](https://react.dev/reference/react) e [Vite](https://vitejs.dev/config/)
* 📖 **Back-end:** [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
* 📖 **Banco de Dados:** [Supabase](https://supabase.com/docs)
* 📖 **Diagramas:** [PlantUML](https://plantuml.com/)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| João Pedro Oliveira | [@jpommoura](https://github.com/jpommoura) |

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelo conteúdo da disciplina e pelo template de documentação.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/blob/main/LICENSE)**.

---
