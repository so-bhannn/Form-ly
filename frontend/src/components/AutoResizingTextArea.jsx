import { useRef, useEffect } from "react";


const AutoResizingTextArea = (props)=>{

 const textareaRef= useRef(null)

 const { value }= props

 useEffect(()=>{
  const textarea= textareaRef.current
  if(textarea){
   textarea.style.height='auto'

   const scrollHeight = textarea.scrollHeight
   textarea.style.height=`${scrollHeight}px`
  }
 },[value])

 return(
  <textarea
  ref={textareaRef}
  rows={1}
  {...props}
  className={`w-full p-2 resize-none overflow-hidden duration-200 ease-in-out ${props.className || ''}`} 
  />
 )
}

export default AutoResizingTextArea