import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface UserProfile {
  nombre: string
  email: string
  rol: string
  comunidad: string
}

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProfile(res.data)
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">Cargando...</p></div>

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-text-secondary mb-6">← Volver</button>
        <h1 className="text-2xl font-bold text-primary-dark mb-6">Mi perfil</h1>

        <div className="bg-surface rounded-2xl shadow p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {profile?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-text-primary text-lg">{profile?.nombre}</p>
              <p className="text-sm text-text-secondary capitalize">{profile?.rol}</p>
            </div>
          </div>

          {[
            { label: 'Correo', value: profile?.email },
            { label: 'Comunidad', value: profile?.comunidad || 'Sin asignar' },
            { label: 'Rol', value: profile?.rol },
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm border-b border-gray-100 pb-3">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-medium text-text-primary">{item.value}</span>
            </div>
          ))}

          <button
            onClick={() => navigate('/vehicles')}
            className="w-full mt-2 border border-primary text-primary font-semibold rounded-lg py-2.5 hover:bg-green-50 transition"
          >
            Mis vehículos
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile