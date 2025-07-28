import { useState, useCallback } from "react";
import {useAuth} from '../hooks'
import { FormsContext } from "./appContext";
import api from "../api/axios";

export const FormProvider=({children})=>{
    const {accessToken}=useAuth()

    const [forms, setForms]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [error,setError]=useState(null)

    const fetchForms = useCallback(async()=>{
        if(!forms && accessToken){
            try{
                setIsLoading(true)
                const response = await api.get('forms/')
                const formsData = response.data
                const sortedForms = [...formsData].sort((a,b)=>{
                    return new Date(b.updated_at)-new Date(a.updated_at)
                })
                setForms(sortedForms)
            }
            catch(err){
                const errorMessage = err.response?.data?.detail || 'Error fetching forms, try again later.'
                setError(errorMessage)
            }finally{
                setIsLoading(false)
            }
        }
    }, [forms, accessToken])

    const formsContextValue={
        forms,
        setForms,
        isLoading,
        error,
        fetchForms
    }

    return(
        <FormsContext.Provider value={formsContextValue}>
            {children}
        </FormsContext.Provider>
    )
}