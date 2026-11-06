import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Pedidos({ session }) {
  const cliente = session.role === 'CLIENTE'
  const [pedidos, setPedidos] = useState([])
  const [autos, setAutos] = useState([])
  const [f, setF] = useState({ automovelId: '', dataInicio: '', dataFim: '' })
  const [editId, setEditId] = useState(null)
  const [erro, setErro] = useState('')

  const carregar = () => api('/pedidos').then(setPedidos).catch((e) => setErro(e.message))
  useEffect(() => { carregar(); api('/automoveis').then(setAutos) }, [])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function acao(fn) {
    setErro('')
    try { await fn(); await carregar() } catch (e) { setErro(e.message) }
  }

  const salvar = (e) => {
    e.preventDefault()
    acao(async () => {
      const body = { ...f, automovelId: Number(f.automovelId) }
      await api(editId ? `/pedidos/${editId}` : '/pedidos', { method: editId ? 'PUT' : 'POST', body })
      setF({ automovelId: '', dataInicio: '', dataFim: '' }); setEditId(null)
    })
  }

  const avaliar = (p, aprovado) => {
    const parecer = prompt('Parecer financeiro:') ?? ''
    let valorCredito = null
    if (aprovado && session.role === 'BANCO') {
      const v = prompt('Valor do crédito concedido (opcional):')
      if (v) valorCredito = Number(v)
    }
    acao(() => api(`/pedidos/${p.id}/avaliacao`, { method: 'PATCH', body: { aprovado, parecer, valorCredito } }))
  }

  return (
    <div>
      <h2>Pedidos de aluguel</h2>
      {cliente && (
        <form onSubmit={salvar} className="grid">
          <select value={f.automovelId} onChange={set('automovelId')} required>
            <option value="">Selecione o automóvel</option>
            {autos.map((a) => <option key={a.id} value={a.id}>{a.marca} {a.modelo} ({a.placa})</option>)}
          </select>
          <input type="date" value={f.dataInicio} onChange={set('dataInicio')} required />
          <input type="date" value={f.dataFim} onChange={set('dataFim')} required />
          <button type="submit">{editId ? 'Salvar alterações' : 'Criar pedido'}</button>
        </form>
      )}
      {erro && <p className="erro">{erro}</p>}
      <table>
        <thead><tr><th>#</th>{!cliente && <th>Cliente</th>}<th>Automóvel</th><th>Período</th><th>Status</th><th>Parecer / Crédito</th><th>Ações</th></tr></thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              {!cliente && <td>{p.clienteNome}</td>}
              <td>{p.automovel.marca} {p.automovel.modelo} ({p.automovel.placa})</td>
              <td>{p.dataInicio} → {p.dataFim}</td>
              <td><span className={`badge ${p.status}`}>{p.status}</span></td>
              <td>{p.parecer}{p.valorCredito ? ` | Crédito R$ ${p.valorCredito} (${p.banco})` : ''}</td>
              <td className="acoes">
                {cliente && p.status === 'PENDENTE' && (
                  <button onClick={() => { setEditId(p.id); setF({ automovelId: p.automovel.id, dataInicio: p.dataInicio, dataFim: p.dataFim }) }}>Editar</button>
                )}
                {cliente && ['PENDENTE', 'APROVADO'].includes(p.status) && (
                  <button className="perigo" onClick={() => confirm('Cancelar pedido?') && acao(() => api(`/pedidos/${p.id}`, { method: 'DELETE' }))}>Cancelar</button>
                )}
                {!cliente && p.status === 'PENDENTE' && (<>
                  <button onClick={() => avaliar(p, true)}>Aprovar</button>
                  <button className="perigo" onClick={() => avaliar(p, false)}>Reprovar</button>
                </>)}
                {!cliente && p.status === 'APROVADO' && (
                  <button onClick={() => acao(() => api(`/pedidos/${p.id}/contrato`, { method: 'PATCH' }))}>Executar contrato</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
