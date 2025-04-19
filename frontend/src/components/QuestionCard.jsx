import {
    Button,
    CustomSelect,
} from '../components'
import { useState } from "react"

export default function QuestionCard({
    edit=true,
    removeQuestion,
    question,
    oneQuestionRemains,
}){
    const options=[
        {value:'SA', label:'Short Question'},
        {value:'PA', label:'Paragraph'},
        {value:'MC', label:'Multiple Choice'},
        {value:'CB', label:'Checkboxes'},
        {value:'DD', label:'Drop-down'},
    ]
    const[isRequired,setIsRequired]=useState(false)
    const[question_type, setQuestion_type]=useState(question.question_type)

    
    const [mcOptions,setMcOptions]=useState([
        {id:1, text:'Option 1'}
    ])

    const addMcOption=()=>{
        const newId=mcOptions.length>0
        ? Math.max(...mcOptions.map(option=> option.id))+1
        : 1;

        setMcOptions([...mcOptions,{id:newId,text:`Option ${newId}`}])
    }

    const removeMcOption=(id)=>{
        if(mcOptions.length<=1) return;
        setMcOptions(mcOptions.filter(option=>option.id!==id))
    }

    const updateMcOption=(id,text)=>{
        setMcOptions(mcOptions.map(option=>
            option.id===id?{...option,text}:option))
    }

    const handleTypeChange=(value)=>{
        question.question_type=value;
        setQuestion_type(value);
    }

    return(
        <div className="flex w-full rounded-lg border border-gray-200">
            <div className="opacity-50 flex items-center self-stretch justify-center w-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical h-5 w-5 cursor-grab">
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                </svg>
            </div>
            <div className="w-full p-5 pl-0">
                <div className="flex justify-between">
                    <div className="flex-1 max-w-4xl">
                        <input
                            type="text"
                            placeholder="Question"
                            className="w-full flex-wrap text-xl font-medium p-2 focus:outline-0 focus:border-b-1 border-b-black/40 focus:bg-gray-50"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div id='required' className="flex items-center ml-2">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isRequired}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full hover:cursor-pointer transition-colors ease-in-out ${isRequired?'bg-black/80':'bg-gray-200'}`}
                                onClick={()=> setIsRequired(!isRequired)}
                            >
                                <span
                                    className={`${
                                        isRequired ? 'translate-x-5' : 'translate-x-1'
                                    } inline-block h-3.5 w-3.5 transform ease-in-out rounded-full bg-white transition`}
                                >
                                </span>
                            </button>
                        </div>
                        <label htmlFor="required" className="text-sm font-medium">Required</label>
                        <button
                        onClick={()=>removeQuestion(question.id)}
                        disabled={oneQuestionRemains}
                        className={`w-9 h-9 inline-flex justify-center items-center rounded-lg ${!oneQuestionRemains?'hover:bg-gray-100 hover:cursor-pointer':'hover:cursor-not-allowed'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={oneQuestionRemains?"gray":"black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 h-5 w-5 ">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="mt-3">
                    <CustomSelect
                        onChange={handleTypeChange}
                        options={options}
                        defaultValue={options.find(option => option.value === question_type) || options[0]}
                    />
                </div>
                {question_type==='SA' && (
                    <div className='ml-5 mt-5 w-2xl outline outline-gray-100 rounded-lg overflow-hidden'>
                        <input
                        type="text"
                        placeholder='Short Answer text'
                        disabled={edit}
                        className={`w-full h-full p-2.5 rounded-lg ${edit?'cursor-not-allowed':''}`}
                    />
                    </div>
                )}
                {question_type==='PA' && (
                    <div className='ml-5 mt-5 p-1 w-2xl'>
                        <textarea
                        type="text"
                        name=""
                        id=""
                        placeholder='Long Answer text'
                        disabled={edit}
                        className={`min-h-20 w-full h-full p-2.5 rounded-lg outline outline-gray-100 focus-visible:ring-1 focus-visible:ring-offset-2 ${edit?'cursor-not-allowed':''}`}
                    />
                    </div>
                )}
                {question_type==='MC' && (
                    <div className='ml-5 mt-5 p-1 w-2xl'>
                        {mcOptions.map((option)=>(
                            <div key={option.id} className='flex items-center mb-2 gap-2'>
                                <input
                                    type="radio"
                                    disabled={edit}
                                />
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e)=>updateMcOption(option.id,e.target.value)}
                                    className={`scale- p-2 rounded-lg outline outline-gray-100 focus:outline-1 focus:outline-black/40`}
                                />
                            <button
                                onClick={()=>removeMcOption(option.id)}
                                className={`w-7 h-7 inline-flex justify-center items-center rounded-lg ${mcOptions.length>1?'hover:bg-gray-100 hover:cursor-pointer':''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mcOptions.length>1?'black':'gray'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 h-4 w-4 ">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" x2="10" y1="11" y2="17"></line>
                                    <line x1="14" x2="14" y1="11" y2="17"></line>
                                </svg>
                            </button>
                            </div>
                        ))}
                        <div>
                            <Button
                                content='Add Option'
                                icon='bx bx-plus'
                                black={false}
                                scale={90}
                                onClick={addMcOption}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}