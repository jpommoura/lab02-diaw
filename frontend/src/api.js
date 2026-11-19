import { mockApi } from './mock'

const BASE = import.meta.env.VITE_API_URL || '/api'
export const MOCK = import.meta.env.MODE === 'demo' || import.meta.env.VITE_MOCK === 'true'

export const getSession = () => JSON.parse(localStorage.getItem('session') || 'null')
export const setSession = (s) =>
  s ? localStorage.setItem('session', JSON.stringify(s)) : localStorage.removeItem('session')

export async function api(path, { method = 'GET', body } = {}) {
  const s = getSession()

  // Modo demonstração: sem back-end, dados simulados no navegador
  if (MOCK) {
    try {
      return await mockApi(path, method, body, s?.token)
    } catch (err) {
      if (err.status === 401 && s) { setSession(null); window.location.reload() }
      throw err
    }
  }

  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(s ? { Authorization: `Bearer ${s.token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401 && s) {
    setSession(null)
    window.location.reload()
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.erro || 'Erro na requisição')
  return data
}
