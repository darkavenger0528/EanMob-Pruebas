import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-primary-dark">EANMob</h1>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
            className="text-sm text-text-secondary hover:text-red-500 transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/publish-trip')}
            className="bg-surface rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">🚗</div>
            <h2 className="font-semibold text-text-primary">Publicar viaje</h2>
            <p className="text-sm text-text-secondary mt-1">Ofrece cupos como conductor</p>
          </div>
          <div
            onClick={() => navigate('/search-trips')}
            className="bg-surface rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="font-semibold text-text-primary">Buscar viaje</h2>
            <p className="text-sm text-text-secondary mt-1">Encuentra un cupo disponible</p>
          </div>
          <div
            onClick={() => navigate('/my-trips')}
            className="bg-surface rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">📋</div>
            <h2 className="font-semibold text-text-primary">Mis viajes</h2>
            <p className="text-sm text-text-secondary mt-1">Historial y estado</p>
          </div>
          <div
            onClick={() => navigate('/profile')}
            className="bg-surface rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">👤</div>
            <h2 className="font-semibold text-text-primary">Mi perfil</h2>
            <p className="text-sm text-text-secondary mt-1">Datos personales y vehículos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard