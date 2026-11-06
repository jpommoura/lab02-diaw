import { useState } from 'react'
import { api } from '../api'

export default function Auth({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [f, setF] = useState({ username: '', senha: '', role: 'CLIENTE' })
  const [erro, setErro] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    try {
      const body = modo === 'login' ? { username: f.username, senha: f.senha } : f
      onLogin(await api(`/auth/${modo === 'login' ? 'login' : 'register'}`, { method: 'POST', body }))
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="container auth">
      <h1>🚗 Aluguel de Carros</h1>
      <form onSubmit={enviar}>
        <h2>{modo === 'login' ? 'Entrar' : 'Cadastrar-se'}</h2>
        <input placeholder="Usuário" value={f.username} onChange={set('username')} required />
        <input type="password" placeholder="Senha (mín. 6)" value={f.senha} onChange={set('senha')} required />
        {modo === 'register' && (
          <select value={f.role} onChange={set('role')}>
            <option value="CLIENTE">Cliente</option>
            <option value="EMPRESA">Agente - Empresa</option>
            <option value="BANCO">Agente - Banco</option>
          </select>
        )}
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">{modo === 'login' ? 'Entrar' : 'Criar conta'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setModo(modo === 'login' ? 'register' : 'login') }}>
          {modo === 'login' ? 'Não tenho conta' : 'Já tenho conta'}
        </a>
      </form>
    </div>
  )
}
