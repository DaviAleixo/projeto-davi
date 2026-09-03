import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FormularioDavi from './pages/FormularioDavi'
import Portfolio from './pages/Portfolio'
import Formulario from './pages/Formulario'
import Links from './pages/Links'
import Curriculo from './pages/Curriculo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormularioDavi />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/curriculo" element={<Curriculo />} />
        <Route path="/especificacoes-tecnicas" element={<Curriculo />} />
        <Route path="/cv" element={<Curriculo />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/links" element={<Links />} />
      </Routes>
    </Router>
  )
}

export default App



