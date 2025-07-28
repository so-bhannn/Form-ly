import Button from './Button'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const FormCard = ({
    title='Untitled Form',
    accentColor='gray',
    description='No description',
    lastUpdated=null,
    responses=0,
    formID,
})=>{
    
    const navigate =useNavigate()
    const [isSmallScreen,setIsSmallScreen]=useState(false)
    const checkSmallScreen = ()=>{
        setIsSmallScreen(window.innerWidth < 1024)
    }

    useEffect(()=>{
        checkSmallScreen()
        window.addEventListener('resize',checkSmallScreen)

        return ()=> window.removeEventListener('resize', checkSmallScreen)
    }, [])

    const openEdit = (id)=>{
        console.log(id)
        navigate(`/edit/${id}`)
    }

    const trimDescription = (str)=>{
        if(str.length>40 && isSmallScreen){
            return str.substr(0,30)+ '...'
        }
        else if(str.length>50 && !isSmallScreen){
            return str.substr(0,50)+'...'
        }
        return str
    }

    const getColorClass = () =>{
        const mapColor = {
            'gray': 'bg-gray-300',
            'red': 'bg-red-300',
            'blue': 'bg-blue-300',
            'green': 'bg-green-300',
            'yellow': 'bg-yellow-300',
            'violet': 'bg-violet-300',
            'pink': 'bg-pink-300',
            'orange': 'bg-orange-300'
        }

        return mapColor[accentColor] || 'bg-gray-300'
    }

    return(
        <div className="bg-white flex flex-col h-60 lg:min-w-1/2 justify-between rounded-xl outline-1 outline-gray-200 shadow-sm box-border gap-2 overflow-hidden hover:shadow-lg transition-all duration-300">
            <span className={`w-full h-3 ${getColorClass()} opacity-50`}></span>
            <div className='px-8 pb-8'>
                <div className="flex flex-col">
                <div className="text-3xl font-semibold">
                    {title}
                </div>
                <div className='flex flex-col text-black/50 gap-3'>
                    <div className='text-md font-medium'>{trimDescription(description)}</div>
                    {lastUpdated && <div className='text-sm'>{`Last Updated: ${lastUpdated} days ago`}</div>}
                </div>
            </div>
            <div className='text-sm text-black/50 py-2'>{`${responses} Responses`}</div>
            <div className='flex gap-5'>
                <Button 
                content='Edit'
                black={false}
                onClick={()=>openEdit(formID)}
                ></Button>
                <a href={formID ? `formLink/responses/${formID}`:''}><Button content='View Responses'></Button></a>
            </div>
            </div>
        </div>
    )
}

export default FormCard