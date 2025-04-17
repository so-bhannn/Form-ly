import { useState, useEffect, useRef } from 'react';

const CustomSelect = ({onChange, options, defaultValue, label, icon})=>{
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(defaultValue||options[0])
  const dropdownRef = useRef(null)

  useEffect(()=>{
    const handleClickOutside = (event)=>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown',handleClickOutside)
    return ()=>{
      document.removeEventListener('mousedown', handleClickOutside)
    }
  },[])
  
  const handleSelect = (option)=>{
    setSelectedOption(option);
    setIsOpen(false);

    if(onChange) onChange(option.value);
  }

  return(
    <div className='inline-block relative w-44 mr-6' ref={dropdownRef}>
      {label && <span className='flex items-center p-1 gap-1 text-sm text-black/60'>{ icon && <i className={`bx bx-${icon}`}></i>}{label}</span> }
      <button 
      onClick={()=>setIsOpen(!isOpen)}
      className='flex items-center justify-between w-full border border-gray-300 rounded-md p-2 hover:cursor-pointer focus:ring-1 focus:ring-black/80 '>
        <span className='text-sm'>{selectedOption.label}</span>
        <i className={`bx bx-chevron-down transition-transform ${isOpen ? 'rotate-180':''}`}></i>
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full rounded-md bg-white border border-gray-300'>
          <ul className='py-1 max-h-50 overflow-auto'>
            {options.map((option)=>{
              return(
              <li
                key={option.value}
                onClick={()=>handleSelect(option)}
                className={`px-3 py-1 text-sm text-black/60 ${selectedOption.value===option.value?'text-black/80 bg-gray-100':''} hover:text-black/80 hover:bg-gray-100 hover:cursor-pointer`}
              >
                {option.label}
              </li>
            )
            })}
          </ul>
        </div>
      )}
    </div>
  )

}

export default CustomSelect