import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('http://localhost:3001/api/auth/verify-otp', { email, otp })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP inválido o expirado')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/resend-otp', { email })
      setResent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al reenviar OTP')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Verifica tu correo</h1>
        <p className="text-text-secondary mb-6">
          Ingresa el código de 6 dígitos enviado a <span className="font-medium text-text-primary">{email}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {resent && (
          <div className="bg-green-50 text-green-600 text-sm rounded-lg p-3 mb-4">
            Código reenviado exitosamente
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Código OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          ¿No recibiste el código?{' '}
          <span onClick={handleResend} className="text-primary cursor-pointer font-medium">
            Reenviar
          </span>
        </p>
      </div>
    </div>
  )
}

export default VerifyOtp