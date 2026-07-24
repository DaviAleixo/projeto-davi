import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FormularioDavi from './pages/FormularioDavi'
import Portfolio from './pages/Portfolio'
import Formulario from './pages/Formulario'
import Links from './pages/Links'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormularioDavi />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/links" element={<Links />} />
      </Routes>
    </Router>
  )
}

export default App



