import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import CustomNavbar from './components/CustomNavbar'

function App() {
  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
      </Routes>
    </>
  )
}

export default App
