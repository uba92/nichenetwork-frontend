import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminRoute from './AdminRoute'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageCommunities from '../pages/admin/ManageCommunities'
import Settings from '../pages/admin/Settings'
import ProtectedRoute from './ProtectedRoute'
import UserHome from '../pages/UserHome'
import UserDetails from '../pages/admin/UserDetails'
import CommunityDetails from '../pages/admin/CommunityDetails'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<UserHome />} />
      </Route>

      <Route path='/admin/*' element={<AdminRoute />}>
        <Route path='' element={<AdminDashboard />}>
          <Route path='gestione-utenti' element={<ManageUsers />} />
          <Route path='gestione-utenti/:id' element={<UserDetails />} />
          <Route path='gestione-community' element={<ManageCommunities />} />
          <Route path='gestione-community/:id' element={<CommunityDetails />} />
          <Route path='impostazioni' element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
