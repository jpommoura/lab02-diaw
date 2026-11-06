import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Clientes() {
  const [lista, setLista] = useState([])
  useEffect(() => { api('/clientes').then(setLista).catch(() => {}) }, [])
  return (
    <div>
      <h2>Clientes</h2>
      <table>
        <thead><tr><th>Nome</th><th>CPF</th><th>RG</th><th>Profissão</th><th>Rendimentos</th></tr></thead>
        <tbody>
          {lista.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td><td>{c.cpf}</td><td>{c.rg}</td><td>{c.profissao}</td>
              <td>{c.rendimentos.map((r) => `${r.entidadeEmpregadora}: R$ ${r.valor}`).join(' | ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
