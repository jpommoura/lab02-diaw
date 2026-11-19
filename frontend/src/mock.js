// MODO DEMONSTRAÇÃO: simula o back-end no navegador (localStorage), sem Spring Boot nem Supabase.
// Só é usado quando VITE_MOCK=true (npm run demo). O login real continua intacto em api.js.

const KEY = 'mock-db'

const seed = () => ({
  seq: 100,
  usuarios: [
    { id: 1, username: 'cliente', senha: '123456', role: 'CLIENTE' },
    { id: 2, username: 'empresa', senha: '123456', role: 'EMPRESA' },
    { id: 3, username: 'banco', senha: '123456', role: 'BANCO' },
  ],
  clientes: [
    {
      id: 1, usuarioId: 1, rg: 'MG-12.345.678', cpf: '123.456.789-00', nome: 'Cliente Demonstração',
      endereco: 'Rua Exemplo, 100 - Contagem/MG', profissao: 'Analista',
      rendimentos: [{ entidadeEmpregadora: 'Empresa X', valor: 4500 }],
    },
  ],
  automoveis: [
    { id: 1, matricula: 'MAT-0001', ano: 2022, marca: 'Volkswagen', modelo: 'Polo', placa: 'ABC1D23', tipoProprietario: 'EMPRESA' },
    { id: 2, matricula: 'MAT-0002', ano: 2023, marca: 'Fiat', modelo: 'Pulse', placa: 'EFG4H56', tipoProprietario: 'BANCO' },
    { id: 3, matricula: 'MAT-0003', ano: 2021, marca: 'Chevrolet', modelo: 'Onix', placa: 'IJK7L89', tipoProprietario: 'EMPRESA' },
  ],
  pedidos: [
    {
      id: 1, clienteId: 1, automovelId: 1, dataInicio: '2026-12-01', dataFim: '2026-12-10',
      status: 'PENDENTE', parecer: null, valorCredito: null, banco: null, criadoEm: new Date().toISOString(),
    },
  ],
})

const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') || seed()
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db))
const next = (db) => ++db.seq

class HttpError extends Error {}
const fail = (msg) => { throw new HttpError(msg) }

const usuarioDoToken = (db, token) => db.usuarios.find((u) => `mock-${u.id}` === token)
const auth = (u) => ({ token: `mock-${u.id}`, username: u.username, role: u.role })
const agente = (u) => u.role !== 'CLIENTE'

const pedidoResp = (db, p) => {
  const c = db.clientes.find((x) => x.id === p.clienteId)
  const a = db.automoveis.find((x) => x.id === p.automovelId)
  return { ...p, clienteNome: c?.nome ?? '-', automovel: a }
}
const clienteResp = ({ usuarioId, ...c }) => c

function validarCliente(b) {
  for (const k of ['rg', 'cpf', 'nome', 'endereco', 'profissao']) if (!b[k]) fail(`${k}: não pode estar em branco`)
  if ((b.rendimentos || []).length > 3) fail('rendimentos: máximo de 3 rendimentos')
}
function validarPedido(db, b) {
  if (!db.automoveis.some((a) => a.id === Number(b.automovelId))) fail('Automóvel não encontrado')
  if (!b.dataInicio || !b.dataFim) fail('Informe as datas')
  if (b.dataFim < b.dataInicio) fail('A data final não pode ser anterior à data inicial')
}

export async function mockApi(path, method, body, token) {
  await new Promise((r) => setTimeout(r, 150)) // simula latência
  const db = load()
  const p = path.split('?')[0]
  let m

  // ---------- Auth ----------
  if (p === '/auth/register' && method === 'POST') {
    if (!body.username || body.username.length < 3) fail('username: tamanho deve ser entre 3 e 50')
    if (!body.senha || body.senha.length < 6) fail('senha: tamanho deve ser entre 6 e 100')
    if (db.usuarios.some((u) => u.username === body.username)) fail('Usuário já cadastrado')
    const u = { id: next(db), username: body.username, senha: body.senha, role: body.role || 'CLIENTE' }
    db.usuarios.push(u); save(db)
    return auth(u)
  }
  if (p === '/auth/login' && method === 'POST') {
    const u = db.usuarios.find((x) => x.username === body.username && x.senha === body.senha)
    if (!u) fail('Usuário ou senha inválidos')
    return auth(u)
  }

  // ---------- Rotas protegidas ----------
  const u = usuarioDoToken(db, token)
  if (!u) { const e = new HttpError('Não autenticado'); e.status = 401; throw e }
  const meuCliente = () => db.clientes.find((c) => c.usuarioId === u.id)

  // Automóveis
  if (p === '/automoveis' && method === 'GET') return db.automoveis
  if (p === '/automoveis' && method === 'POST') {
    for (const k of ['matricula', 'marca', 'modelo', 'placa']) if (!body[k]) fail(`${k}: não pode estar em branco`)
    if (db.automoveis.some((a) => a.placa === body.placa || a.matricula === body.matricula))
      fail('Dado duplicado (CPF, placa, matrícula...) ou registro em uso')
    const a = { ...body, id: next(db) }
    db.automoveis.push(a); save(db)
    return a
  }

  // Clientes
  if (p === '/clientes/me') {
    if (u.role !== 'CLIENTE') fail('Acesso negado')
    const c = meuCliente()
    if (method === 'GET') { if (!c) fail('Cliente não encontrado'); return clienteResp(c) }
    if (method === 'PUT') {
      if (!c) fail('Cliente não encontrado')
      validarCliente(body); Object.assign(c, body, { id: c.id, usuarioId: u.id }); save(db)
      return clienteResp(c)
    }
    if (method === 'DELETE') {
      if (!c) fail('Cliente não encontrado')
      db.pedidos = db.pedidos.filter((x) => x.clienteId !== c.id)
      db.clientes = db.clientes.filter((x) => x.id !== c.id); save(db)
      return null
    }
  }
  if (p === '/clientes' && method === 'POST') {
    if (meuCliente()) fail('Cliente já cadastrado')
    validarCliente(body)
    const c = { ...body, id: next(db), usuarioId: u.id }
    db.clientes.push(c); save(db)
    return clienteResp(c)
  }
  if (p === '/clientes' && method === 'GET') {
    if (!agente(u)) fail('Acesso negado')
    return db.clientes.map(clienteResp)
  }

  // Pedidos
  if (p === '/pedidos' && method === 'GET') {
    const c = meuCliente()
    const lista = agente(u) ? db.pedidos : db.pedidos.filter((x) => c && x.clienteId === c.id)
    return [...lista].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).map((x) => pedidoResp(db, x))
  }
  if (p === '/pedidos' && method === 'POST') {
    if (u.role !== 'CLIENTE') fail('Acesso negado')
    const c = meuCliente()
    if (!c) fail('Complete seu cadastro de cliente antes de criar um pedido')
    validarPedido(db, body)
    const ped = {
      id: next(db), clienteId: c.id, automovelId: Number(body.automovelId), dataInicio: body.dataInicio,
      dataFim: body.dataFim, status: 'PENDENTE', parecer: null, valorCredito: null, banco: null,
      criadoEm: new Date().toISOString(),
    }
    db.pedidos.push(ped); save(db)
    return pedidoResp(db, ped)
  }
  if ((m = p.match(/^\/pedidos\/(\d+)(\/(avaliacao|contrato))?$/))) {
    const ped = db.pedidos.find((x) => x.id === Number(m[1]))
    const c = meuCliente()
    if (!ped || (!agente(u) && (!c || ped.clienteId !== c.id))) fail('Pedido não encontrado')
    const acao = m[3]

    if (!acao && method === 'GET') return pedidoResp(db, ped)
    if (!acao && method === 'PUT') {
      const ok = agente(u) ? ['PENDENTE', 'APROVADO'].includes(ped.status) : ped.status === 'PENDENTE'
      if (!ok) fail(`Pedido não pode mais ser modificado (status ${ped.status})`)
      validarPedido(db, body)
      Object.assign(ped, { automovelId: Number(body.automovelId), dataInicio: body.dataInicio, dataFim: body.dataFim })
      save(db); return pedidoResp(db, ped)
    }
    if (!acao && method === 'DELETE') {
      if (u.role !== 'CLIENTE') fail('Acesso negado')
      if (!['PENDENTE', 'APROVADO'].includes(ped.status)) fail(`Pedido não pode ser cancelado (status ${ped.status})`)
      ped.status = 'CANCELADO'; save(db); return pedidoResp(db, ped)
    }
    if (acao === 'avaliacao' && method === 'PATCH') {
      if (!agente(u)) fail('Acesso negado')
      if (ped.status !== 'PENDENTE') fail('Apenas pedidos PENDENTES podem ser avaliados')
      ped.parecer = body.parecer || null
      if (body.aprovado) {
        ped.status = 'APROVADO'
        if (u.role === 'BANCO' && body.valorCredito) { ped.valorCredito = Number(body.valorCredito); ped.banco = u.username }
      } else ped.status = 'REPROVADO'
      save(db); return pedidoResp(db, ped)
    }
    if (acao === 'contrato' && method === 'PATCH') {
      if (!agente(u)) fail('Acesso negado')
      if (ped.status !== 'APROVADO') fail('Apenas pedidos APROVADOS podem virar contrato')
      ped.status = 'CONTRATADO'; save(db); return pedidoResp(db, ped)
    }
  }

  fail(`Rota não simulada: ${method} ${path}`)
}

export const resetMock = () => localStorage.removeItem(KEY)
