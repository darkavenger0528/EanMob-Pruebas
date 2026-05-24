import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  conductor: string
}

const TripDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`http://localhost:3001/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTrip(res.data)
      } catch {
        setTrip(null)
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  const handleRequest = async () => {
    setRequesting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`http://localhost:3001/api/trips/${id}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/my-trips')
    } catch {
      setRequesting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">Cargando...</p></div>
  if (!trip) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">Viaje no encontrado</p></div>

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-text-secondary mb-6">← Volver</button>
        <div className="bg-surface rounded-2xl shadow p-6">
          <h1 className="text-xl font-bold text-primary-dark mb-1">{trip.origen} → {trip.destino}</h1>
          <p className="text-text-secondary text-sm mb-6">{trip.fecha} · {trip.hora}</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Conductor</span>
              <span className="font-medium text-text-primary">{trip.conductor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Cupos disponibles</span>
              <span className="font-medium text-text-primary">{trip.cupos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Precio por cupo</span>
              <span className="font-medium text-primary">${trip.precio.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Estado</span>
              <span className="font-medium text-text-primary">{trip.estado}</span>
            </div>
          </div>

          <button
            onClick={handleRequest}
            disabled={requesting || trip.cupos === 0}
            className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 hover:bg-green-600 transition disabled:opacity-50"
          >
            {requesting ? 'Enviando solicitud...' : 'Solicitar cupo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripDetail