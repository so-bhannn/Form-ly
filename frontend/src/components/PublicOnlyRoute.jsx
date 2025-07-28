import { Navigate, Outlet } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const PublicOnlyRoute = ()=>{
    const {accessToken, isLoading } =useAuth()

    if(isLoading){
        return <div>Loading...</div>
    }

    if(accessToken){
        return <Navigate to={'/dashboard'}/>
    }

    return <Outlet/>
}

export default PublicOnlyRoute