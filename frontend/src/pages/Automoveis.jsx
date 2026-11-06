import { useEffect, useState } from 'react'
import { api } from '../api'

const vazio = { matricula: '', ano: 2024, marca: '', modelo: '', placa: '', tipoProprietario: 'EMPRESA' }

export default function Automoveis() {
  const [lista, setLista] = useState([])
  const [f, setF] = useState(vazio)
  const [erro, setErro] = useState('')
  const carregar = () => api('/automoveis').then(setLista)
  useEffect(() => { carregar() }, [])
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    try {
      await api('/automoveis', { method: 'POST', body: { ...f, ano: Number(f.ano) } })
      setF(vazio); carregar()
    } catch (err) { setErro(err.message) }
  }

  return (
    <div>
      <h2>Automóveis</h2>
      <form onSubmit={salvar} className="grid">
        <input placeholder="Matrícula" value={f.matricula} onChange={set('matricula')} required />
        <input type="number" placeholder="Ano" value={f.ano} onChange={set('ano')} required />
        <input placeholder="Marca" value={f.marca} onChange={set('marca')} required />
        <input placeholder="Modelo" value={f.modelo} onChange={set('modelo')} required />
        <input placeholder="Placa" value={f.placa} onChange={set('placa')} required />
        <select value={f.tipoProprietario} onChange={set('tipoProprietario')}>
          <option value="CLIENTE">Propriedade do cliente</option>
          <option value="EMPRESA">Propriedade da empresa</option>
          <option value="BANCO">Propriedade do banco</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
      <table>
        <thead><tr><th>Marca</th><th>Modelo</th><th>Ano</th><th>Placa</th><th>Matrícula</th><th>Proprietário</th></tr></thead>
        <tbody>
          {lista.map((a) => (
            <tr key={a.id}><td>{a.marca}</td><td>{a.modelo}</td><td>{a.ano}</td><td>{a.placa}</td><td>{a.matricula}</td><td>{a.tipoProprietario}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
