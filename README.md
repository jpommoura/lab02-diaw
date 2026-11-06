# 🚗 Sistema de Aluguel de Carros

Laboratório 02 — DIAW (PUC Minas, Engenharia de Software).
> Ajuste este README ao [template da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md) (nomes, integrantes, prints).

## Descrição
Sistema web para gestão de aluguéis de automóveis: clientes criam, modificam, consultam e cancelam pedidos; agentes (empresas e bancos) avaliam financeiramente os pedidos, registram crédito e executam o contrato. Acesso apenas com cadastro e login.

## Stack
| Camada | Tecnologia |
|---|---|
| Linguagem | Java (JDK 25) |
| Back-end | Spring Boot 4.0.x, arquitetura MVC, Spring Security + JWT |
| Build | Apache Maven |
| Front-end | React + Vite |
| Banco | Supabase (PostgreSQL) |

## Estrutura
```
backend/   Spring Boot (model, repository, service, controller, dto, security, exception)
frontend/  React + Vite (pages, api)
docs/      Casos de uso, classes, pacotes (PlantUML) e histórias do usuário
```

## Como executar
### 1. Banco (Supabase)
Crie um projeto no Supabase e copie os dados de conexão (Session pooler, porta 5432). As tabelas são criadas automaticamente (`ddl-auto=update`).

### 2. Back-end
```bash
cd backend
cp .env.example .env     # preencha DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET
mvn spring-boot:run      # http://localhost:8080
```
### 3. Front-end
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173 (proxy /api -> :8080)
```

## Fluxo de teste
1. Cadastre-se como **Cliente** → aba *Meu cadastro* → preencha os dados.
2. Aba *Automóveis* → cadastre um carro → aba *Pedidos* → crie um pedido (PENDENTE).
3. Saia e cadastre-se como **Banco** ou **Empresa** → aprove/reprove o pedido (banco pode informar crédito) → *Executar contrato*.
4. Volte como cliente e veja o status atualizado.

## API (resumo)
| Método | Rota | Quem |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | público |
| POST/GET/PUT/DELETE | `/api/clientes`, `/api/clientes/me` | cliente |
| GET | `/api/clientes`, `/api/clientes/{id}` | agentes |
| GET/POST | `/api/automoveis` | autenticado |
| POST | `/api/pedidos` | cliente |
| GET | `/api/pedidos`, `/api/pedidos/{id}` | autenticado (cliente vê só os seus) |
| PUT | `/api/pedidos/{id}` | cliente (PENDENTE) / agentes |
| DELETE | `/api/pedidos/{id}` | cliente (cancela) |
| PATCH | `/api/pedidos/{id}/avaliacao`, `/contrato` | agentes |

## Diagramas (UML)
Em `docs/`: `casos-de-uso.puml`, `classes.puml`, `pacotes.puml` e `historias-de-usuario.md`. Renderize com a extensão PlantUML do VS Code ou em plantuml.com. Mantenha-os atualizados conforme o feedback em aula.

## Integrantes
- Nome — matrícula
