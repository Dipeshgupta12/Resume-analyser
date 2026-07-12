import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Analysis from './pages/Analysis'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis/:id" element={<Analysis />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
