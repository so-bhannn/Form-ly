import { Navigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const RootRedirect = ()=>{
    const {accessToken, isLoading } =useAuth()

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!accessToken){
        return <Navigate to={'/home'} replace></Navigate>
    }
    return <Navigate to={'/dashboard'} replace/>
}

export default RootRedirect