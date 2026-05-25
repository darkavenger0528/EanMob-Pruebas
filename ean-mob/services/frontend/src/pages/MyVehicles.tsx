import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Vehicle {
  id: number
  tipo_vehiculo: string
  modelo: number
  placa: string
  color: string
  soat_vigente: boolean
  rtm_vigente: boolean
  rtm_verificado: boolean
  rtm_mensaje: string
}

const MyVehicles = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_VEHICLES_API}/vehicles/my`, { headers })
      setVehicles(res.data)
    } catch {
      setError('Error al cargar vehículos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este vehículo?')) return
    setDeletingId(id)
    try {
      await axios.delete(`${import.meta.env.VITE_VEHICLES_API}/vehicles/my`, { headers })
      setVehicles(v => v.filter(x => x.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar')
    } finally {
      setDeletingId(null)
    }
  }

  const rtmBadge = (v: Vehicle) => {
    if (!v.rtm_verificado)
      return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">RTM no verificado</span>
    return v.rtm_vigente
      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">RTM vigente ✓</span>
      : <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">RTM vencido</span>
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          ← Volver
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary-dark">Mis vehículos</h1>
          <button
            onClick={() => navigate('/register-vehicle')}
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Agregar
          </button>
        </div>

        {loading && <p className="text-sm text-text-secondary text-center py-8">Cargando...</p>}
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

        {!loading && vehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🚗</div>
            <p className="text-text-secondary text-sm">No tienes vehículos registrados.</p>
            <button
              onClick={() => navigate('/register-vehicle')}
              className="mt-4 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-green-600 transition"
            >
              Registrar vehículo
            </button>
          </div>
        )}

        <div className="space-y-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-surface rounded-2xl shadow p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-text-primary capitalize">{v.tipo_vehiculo} · {v.color}</p>
                  <p className="text-sm text-text-secondary">
                    Placa: <span className="font-mono font-medium">{v.placa}</span> · Modelo: {v.modelo}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.soat_vigente ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  SOAT {v.soat_vigente ? 'vigente' : 'no vigente'}
                </span>
              </div>

              <div className="mb-3">{rtmBadge(v)}</div>
              {v.rtm_mensaje && <p className="text-xs text-text-secondary mb-3 italic">{v.rtm_mensaje}</p>}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-vehicle/${v.id}`)}
                  className="flex-1 text-sm border border-primary text-primary font-medium rounded-lg py-2 hover:bg-green-50 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deletingId === v.id}
                  className="flex-1 text-sm border border-red-300 text-red-500 font-medium rounded-lg py-2 hover:bg-red-50 transition disabled:opacity-50"
                >
                  {deletingId === v.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyVehicles