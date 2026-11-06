const BASE = import.meta.env.VITE_API_URL || '/api'

export const getSession = () => JSON.parse(localStorage.getItem('session') || 'null')
export const setSession = (s) =>
  s ? localStorage.setItem('session', JSON.stringify(s)) : localStorage.removeItem('session')

export async function api(path, { method = 'GET', body } = {}) {
  const s = getSession()
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
