import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Trip {
  id: number
  origen: string
  destino: string
  fecha: string
  hora: string
  cupos: number
  precio: number
  estado: string
}

const MyTrips = () => {
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3001/api/trips/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTrips(res.data)
      } catch {
        setTrips([])
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  const estadoColor: Record<string, string> = {
    activo: 'bg-green-100 text-green-700',
    completado: 'bg-blue-100 text-blue-700',
    cancelado: 'bg-red-100 text-red-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-primary-dark mb-6">Mis viajes</h1>

        {loading ? (
          <p className="text-text-secondary text-center py-12">Cargando...</p>
        ) : trips.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow p-8 text-center">
            <p className="text-text-secondary">No tienes viajes aún</p>
            <button
              onClick={() => navigate('/publish-trip')}
              className="mt-4 bg-primary text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-green-600 transition"
            >
              Publicar viaje
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map(trip => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-surface rounded-2xl shadow p-5 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-text-primary">{trip.origen} → {trip.destino}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${estadoColor[trip.estado] || 'bg-gray-100 text-gray-600'}`}>
                    {trip.estado}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{trip.fecha} · {trip.hora}</p>
                <p className="text-sm text-text-secondary">{trip.cupos} cupos · ${trip.precio.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips