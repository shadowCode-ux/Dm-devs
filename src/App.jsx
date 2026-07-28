import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRouter from './router/AppRouter.jsx'
import CursorGlow from './components/ui/CursorGlow.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CursorGlow />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
