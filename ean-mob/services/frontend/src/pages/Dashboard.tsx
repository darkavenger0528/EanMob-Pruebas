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
          {[
            { icon: '🚗', title: 'Publicar viaje', desc: 'Ofrece cupos como conductor', path: '/publish-trip' },
            { icon: '🔍', title: 'Buscar viaje', desc: 'Encuentra un cupo disponible', path: '/search-trips' },
            { icon: '📋', title: 'Mis viajes', desc: 'Historial y estado', path: '/my-trips' },
            { icon: '🚘', title: 'Mis vehículos', desc: 'Gestiona tus vehículos', path: '/my-vehicles' },
            { icon: '👤', title: 'Mi perfil', desc: 'Datos personales', path: '/profile' },
          ].map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-surface rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h2 className="font-semibold text-text-primary">{item.title}</h2>
              <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard