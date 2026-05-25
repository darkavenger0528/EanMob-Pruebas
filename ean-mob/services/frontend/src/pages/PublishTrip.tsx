import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PublishTrip = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    hora_inicio: '',
    hora_fin: '',
    nombre_prestador: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token!.split('.')[1]))
      await axios.post('http://localhost:3002/api/trips', {
        ...form,
        conductor_id: payload.sub,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/my-trips')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al publicar viaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-primary-dark mb-6">Publicar viaje</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow p-6 space-y-4">
          {[
            { label: 'Tu nombre / apodo', name: 'nombre_prestador', type: 'text', placeholder: 'Ej: Carlos M.' },
            { label: 'Origen', name: 'origen', type: 'text', placeholder: 'Ej: Chapinero' },
            { label: 'Destino', name: 'destino', type: 'text', placeholder: 'Ej: Universidad EAN' },
            { label: 'Hora de salida', name: 'hora_inicio', type: 'time', placeholder: '' },
            { label: 'Hora de llegada estimada', name: 'hora_fin', type: 'time', placeholder: '' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
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
            {loading ? 'Publicando...' : 'Publicar viaje'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PublishTrip