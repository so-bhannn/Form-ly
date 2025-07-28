import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider,FormProvider } from './context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FormProvider>
        <App />
      </FormProvider>
    </AuthProvider>
  </StrictMode>,
)