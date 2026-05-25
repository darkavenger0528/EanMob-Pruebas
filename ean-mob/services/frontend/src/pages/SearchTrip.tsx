import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = `${import.meta.env.VITE_TRIPS_API}/v1/search-requests`

interface Match {
  id: number
  origen: string
  destino: string
  hora_inicio: string
  hora_fin: string
  nombre_prestador: string
}

interface SearchRequest {
  id: number
  origen: string
  destino: string
  hora_salida: string
  activa: boolean
}

const SearchTrip = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const [form, setForm] = useState({ origen: '', destino: '', hora_salida: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [mySearches, setMySearches] = useState<SearchRequest[]>([])
  const [submitted, setSubmitted] = useState(false)

  const fetchMySearches = async () => {
    try {
      const res = await axios.get(`${API}/my`, { headers })
      setMySearches(res.data.data)
    } catch {
      // silencioso
    }
  }

  useEffect(() => { fetchMySearches() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMatches([])
    try {
      const res = await axios.post(API, form, { headers })
      const { matches: result } = res.data.data
      setMatches(result?.candidates ?? [])
      setSubmitted(true)
      fetchMySearches()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al publicar búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`, { headers })
      setMySearches(s => s.filter(x => x.id !== id))
    } catch {
      alert('Error al cancelar búsqueda')
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Buscar viaje</h1>
        <p className="text-sm text-text-secondary mb-6">Publica tu búsqueda y el sistema te muestra conductores disponibles.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow p-6 space-y-4 mb-8">
          {[
            { label: 'Origen', name: 'origen', type: 'text', placeholder: 'Ej: Chapinero' },
            { label: 'Destino', name: 'destino', type: 'text', placeholder: 'Ej: Universidad EAN' },
            { label: 'Hora estimada de salida', name: 'hora_salida', type: 'time', placeholder: '' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Publicar búsqueda'}
          </button>
        </form>

        {/* Resultados de coincidencias */}
        {submitted && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-primary-dark mb-3">
              Coincidencias encontradas {matches.length > 0 ? `(${matches.length})` : ''}
            </h2>
            {matches.length === 0 ? (
              <div className="bg-surface rounded-2xl shadow p-6 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm text-text-secondary">No hay viajes disponibles para tu ruta en este momento.</p>
                <p className="text-xs text-text-secondary mt-1">Tu búsqueda quedó registrada. Te notificaremos cuando haya coincidencias.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((m, i) => (
                  <div key={m.id ?? i} className="bg-surface rounded-2xl shadow p-5">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-text-primary">{m.nombre_prestador}</p>
                      <span className="text-xs text-text-secondary">{m.hora_inicio} → {m.hora_fin}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{m.origen} → {m.destino}</p>
                    <button
                      onClick={() => navigate(`/trips/${m.id}`)}
                      className="mt-3 w-full text-sm bg-primary text-white font-medium rounded-lg py-2 hover:bg-green-600 transition"
                    >
                      Ver detalle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mis búsquedas activas */}
        {mySearches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-primary-dark mb-3">Mis búsquedas activas</h2>
            <div className="space-y-3">
              {mySearches.map(s => (
                <div key={s.id} className="bg-surface rounded-2xl shadow p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{s.origen} → {s.destino}</p>
                    <p className="text-xs text-text-secondary">{s.hora_salida}</p>
                  </div>
                  <button
                    onClick={() => handleDeactivate(s.id)}
                    className="text-xs text-red-500 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchTrip