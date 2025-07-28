import { useContext } from "react";
import {FormsContext} from '../context/appContext'

export const useForms = () =>{
    return useContext(FormsContext)
}