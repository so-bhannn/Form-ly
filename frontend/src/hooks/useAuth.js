import { useContext } from "react"
import { AuthContext } from "../context/appContext"

export const useAuth = ()=>{
    return useContext(AuthContext)
}