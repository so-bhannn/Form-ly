import { 
    Button
 } from '../components'

export default function OptionList({
    options,
    type,
    addOption,
    removeOption,
    updateOption,
}){
    return (
    <div>
        {options.map((option,index)=>(
            <div key={option.id} className='flex items-center mb-2 gap-2'>
                {type==='MC' && <input type="radio" disabled></input>}
                {type==='CB' && <input type="checkbox" disabled></input>}
                {type==='DD' && <span>{`${index+1}.`}</span>}
                <input
                    type="text"
                    onChange={(e)=>updateOption(option.id, e.target.value)}
                    value={option.text}
                    className="p-2 rounded-lg outline outline-gray-100 focus:outline-black/40"
                />
                <button
                    onClick={()=>removeOption(option.id)}
                    disabled={options.length===1}
                    className={`w-7 h-7 flex justify-center items-center rounded-lg ${options.length > 1 ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={options.length > 1 ? 'black' : 'gray'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                </button>
            </div>
        ))}
        <Button
            black={false}
            content='Add Option'
            icon='bx bx-plus'
            onClick={addOption}
            scale={90}
        />
    </div>)
}