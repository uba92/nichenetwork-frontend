import { Route, Router, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/login' element={<h1>Login</h1>} />
      </Routes>
    </>
  )
}

export default App
