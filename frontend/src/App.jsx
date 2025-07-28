import { useEffect } from 'react'
import './App.css'

import { useAuth } from './hooks/useAuth'
import { setAuthAccessor } from './api/axios'
import { Routes } from './routes'

function App() {

  const {accessToken, setAccessToken} =useAuth()

  useEffect(()=>{
    setAuthAccessor({
      getAuth: ()=>accessToken,
      setFreshToken:(token)=>setAccessToken(token),
    })
  }, [accessToken, setAccessToken])

  return (
    <>
      <div className="App">
        <Routes/>
      </div>
    </>
  )
}

export default App