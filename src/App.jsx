import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import CustomNavbar from './components/CustomNavbar'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <CustomNavbar />
      <AppRoutes />
    </>
  )
}

export default App
