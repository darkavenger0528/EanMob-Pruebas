import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyOtp from '../pages/VerifyOtp'
import Dashboard from '../pages/Dashboard'
import PublishTrip from '../pages/PublishTrip'
import MyTrips from '../pages/MyTrips'
import TripDetail from '../pages/TripDetail'
import Profile from '../pages/Profile'
import RegisterVehicle from '../pages/RegisterVehicle'
import MyVehicles from '../pages/MyVehicles'
import SearchTrip from '../pages/SearchTrip'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/publish-trip" element={<PublishTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-vehicle" element={<RegisterVehicle />} />
        <Route path="/my-vehicles" element={<MyVehicles />} />
        <Route path="/search-trips" element={<SearchTrip />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter