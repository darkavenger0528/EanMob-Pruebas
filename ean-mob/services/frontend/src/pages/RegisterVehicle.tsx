import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RegisterVehicle = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    tipo_vehiculo: 'carro',
    modelo: '',
    placa: '',
    color: '',
    soat_vigente: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
        const token = localStorage.getItem('token')
        await axios.post(`${import.meta.env.VITE_VEHICLES_API}/vehicles`, {
        ...form,
        modelo: Number(form.modelo),
        }, {
        headers: { Authorization: `Bearer ${token}` }
        })
        navigate('/my-vehicles')
    } catch (err: any) {
        setError(err.response?.data?.message || 'Error al registrar vehículo')
    } finally {
        setLoading(false)
    }
    }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/my-vehicles')} className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Registrar vehículo</h1>
        <p className="text-sm text-text-secondary mb-6">El estado del RTM se verifica automáticamente con la placa.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Tipo de vehículo</label>
            <select
              name="tipo_vehiculo"
              value={form.tipo_vehiculo}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="bicicleta">Bicicleta</option>
            </select>
          </div>

          {[
            { label: 'Modelo (año)', name: 'modelo', type: 'number', placeholder: 'Ej: 2020' },
            { label: 'Placa', name: 'placa', type: 'text', placeholder: 'Ej: ABC123' },
            { label: 'Color', name: 'color', type: 'text', placeholder: 'Ej: Blanco' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form] as string}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          ))}

          <div className="flex items-center gap-3 py-1">
            <input
              id="soat_vigente"
              name="soat_vigente"
              type="checkbox"
              checked={form.soat_vigente}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="soat_vigente" className="text-sm text-text-primary">SOAT vigente</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar vehículo'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterVehicle