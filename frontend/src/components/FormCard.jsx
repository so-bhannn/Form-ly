import Button from './Button'
import { useState, useEffect } from 'react'

const FormCard = ({
    title='Untitled Form',
    description='No description',
    lastUpdated=null,
    responses=0,
    formID,
})=>{
    
    const [isSmallScreen,setIsSmallScreen]=useState(false)
    const checkSmallScreen = ()=>{
        setIsSmallScreen(window.innerWidth < 1024)
    }

    useEffect(()=>{
        checkSmallScreen()
        window.addEventListener('resize',checkSmallScreen)

        return ()=> window.removeEventListener('resize', checkSmallScreen)
    })

    const trimDescription = (str)=>{
        if(str.length>40 && isSmallScreen){
            return str.substr(0,40)+ '...'
        }
        else if(str.length>160 && !isSmallScreen){
            return str.substr(0,160)+'...'
        }
        return str
    }

    return(
        <div className="flex flex-col h-60 w-93 lg:w-full justify-center rounded-lg outline-1 outline-gray-200 shadow-sm p-8 gap-2">
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
                <a href={`formLink/edit/${formID}`}><Button content='Edit' black={false} ></Button></a>
                <a href={`formLink/responses/${formID}`}><Button content='View Responses'></Button></a>
            </div>
        </div>
    )
}

export default FormCard