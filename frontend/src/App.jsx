import { useState } from 'react'
import { getSession, setSession } from './api'
import Auth from './pages/Auth.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Automoveis from './pages/Automoveis.jsx'
import Perfil from './pages/Perfil.jsx'
import Clientes from './pages/Clientes.jsx'

export default function App() {
  const [session, setSess] = useState(getSession())
  const [tab, setTab] = useState('pedidos')

  if (!session) {
    return <Auth onLogin={(s) => { setSession(s); setSess(s) }} />
  }
  const cliente = session.role === 'CLIENTE'
  const sair = () => { setSession(null); setSess(null) }

  return (
    <div className="container">
      <header>
        <h1>Aluguel de Carros</h1>
        <span>{session.username} ({session.role}) <button onClick={sair}>Sair</button></span>
      </header>
      <nav>
        <button className={tab === 'pedidos' ? 'on' : ''} onClick={() => setTab('pedidos')}>Pedidos</button>
        <button className={tab === 'automoveis' ? 'on' : ''} onClick={() => setTab('automoveis')}>Automóveis</button>
        <button className={tab === 'cadastro' ? 'on' : ''} onClick={() => setTab('cadastro')}>
          {cliente ? 'Meu cadastro' : 'Clientes'}
        </button>
      </nav>
      {tab === 'pedidos' && <Pedidos session={session} />}
      {tab === 'automoveis' && <Automoveis />}
      {tab === 'cadastro' && (cliente ? <Perfil /> : <Clientes />)}
    </div>
  )
}
