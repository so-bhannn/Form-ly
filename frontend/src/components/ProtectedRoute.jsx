import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const ProtectedRoute = ()=>{
    const {accessToken, isLoading } = useAuth()
    const location = useLocation()

    if(isLoading){
        return <div>Loading...{accessToken}</div>
    }

    if(!accessToken){
        return <Navigate to={'/login'} state={{from: location}} replace></Navigate>
    }

    return <Outlet/>
}

export default ProtectedRoute