import { useState,useEffect } from "react";
import { AuthContext } from "./appContext";
import api from '../api/axios'

export const AuthProvider = ({children}) =>{
    const[user, setUser] =useState(null)
    const[accessToken, setAccessToken] =useState(null)
    const[isLoading, setIsLoading] =useState(true)

    useEffect(()=>{
        const rehydrateToken= async()=>{
            try{
                const response = await api.post(
                    'auth/token/refresh',
                    {},
                    {_isAuthRefresh:true}
                )
                setAccessToken(response.data.access)
            }catch{
                logout()
            }finally{
                setIsLoading(false)
            }
        }
        rehydrateToken()
    },[])

    const login=(userData, token)=>{
        setUser(userData)
        setAccessToken(token)
    }

    const logout=()=>{
        setUser(null)
        setAccessToken(null)
    }

    const authContextValue={
        user,
        login,
        logout,
        isLoading,
        accessToken,
        setAccessToken,
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
}
