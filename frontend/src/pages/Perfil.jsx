import { useEffect, useState } from 'react'
import { api } from '../api'

const vazio = { rg: '', cpf: '', nome: '', endereco: '', profissao: '', rendimentos: [] }

export default function Perfil() {
  const [f, setF] = useState(vazio)
  const [existe, setExiste] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api('/clientes/me').then((c) => { setF(c); setExiste(true) }).catch(() => setExiste(false))
  }, [])

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const setR = (i, k, v) => setF({ ...f, rendimentos: f.rendimentos.map((r, j) => (j === i ? { ...r, [k]: v } : r)) })

  async function salvar(e) {
    e.preventDefault()
    setMsg('')
    try {
      const body = { ...f, rendimentos: f.rendimentos.map((r) => ({ ...r, valor: Number(r.valor) })) }
      const c = await api('/clientes' + (existe ? '/me' : ''), { method: existe ? 'PUT' : 'POST', body })
      setF(c); setExiste(true); setMsg('Salvo com sucesso!')
    } catch (err) { setMsg(err.message) }
  }

  async function excluir() {
    if (!confirm('Excluir seu cadastro de cliente?')) return
    try { await api('/clientes/me', { method: 'DELETE' }); setF(vazio); setExiste(false); setMsg('Cadastro excluído') }
    catch (err) { setMsg(err.message) }
  }

  return (
    <form onSubmit={salvar}>
      <h2>{existe ? 'Editar cadastro' : 'Criar cadastro de cliente'}</h2>
      <input placeholder="Nome" value={f.nome} onChange={set('nome')} required />
      <input placeholder="RG" value={f.rg} onChange={set('rg')} required />
      <input placeholder="CPF" value={f.cpf} onChange={set('cpf')} required />
      <input placeholder="Endereço" value={f.endereco} onChange={set('endereco')} required />
      <input placeholder="Profissão" value={f.profissao} onChange={set('profissao')} required />
      <h3>Rendimentos ({f.rendimentos.length}/3)</h3>
      {f.rendimentos.map((r, i) => (
        <div className="linha" key={i}>
          <input placeholder="Entidade empregadora" value={r.entidadeEmpregadora}
                 onChange={(e) => setR(i, 'entidadeEmpregadora', e.target.value)} required />
          <input type="number" step="0.01" placeholder="Valor" value={r.valor}
                 onChange={(e) => setR(i, 'valor', e.target.value)} required />
          <button type="button" onClick={() => setF({ ...f, rendimentos: f.rendimentos.filter((_, j) => j !== i) })}>✕</button>
        </div>
      ))}
      {f.rendimentos.length < 3 && (
        <button type="button" onClick={() => setF({ ...f, rendimentos: [...f.rendimentos, { entidadeEmpregadora: '', valor: '' }] })}>
          + Rendimento
        </button>
      )}
      {msg && <p className="msg">{msg}</p>}
      <div className="linha">
        <button type="submit">Salvar</button>
        {existe && <button type="button" className="perigo" onClick={excluir}>Excluir cadastro</button>}
      </div>
    </form>
  )
}
