import { useState, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
    Button,
    QuestionCard
} from '../components'
import { DashboardLayout } from '../layouts'
import { FormViewer } from '../components'
const url = import.meta.env.VITE_API_URL

export default function FormBuilder(){

    const[questions,setQuestions]=useState([
        {id:uuidv4(), text:"", question_type:"SA", is_required:"", order:1, options:[]},
    ])
    
    const dragItem = useRef(null)
    const dragOverItem = useRef(null)

    const [savingForm, setSavingForm] = useState(false)
    const [message, setMessage] = useState({text: null, type: null})

    const [edit, setEdit] = useState(true)

    const addQuestion=()=>{
        const newOrder=questions.length>0
        ? Math.max(...questions.map(question=>question.order))+1
        :1;

        const question_type=questions.length>0
        ? questions[questions.length-1].question_type
        : "SA";

        setQuestions([...questions,{id:uuidv4(), order:newOrder, text:"", question_type:question_type, is_required:false, options:[]}])
    }

    const removeQuestion=(id)=>{
        if(questions.length<=1) return;
        setQuestions(questions.filter(question=>question.id!==id))
    }

    const changeQuestionType=(id,value)=>{
        setQuestions(questions.map((question)=>
            question.id===id
            ? {...question, question_type:value}
            : question
        ))
    }

    const changeQuestionText=(id,value)=>{
        setQuestions(questions.map((question)=>
        question.id===id
        ? {...question, text:value}
        : question
    ))
    }

    const changeOptions=useCallback((id,value)=>{
        setQuestions(questions.map((question)=>
            question.id===id
            ? {...question, options: value}
            : question
        ))
    },[questions])

    const handleSort = () => {
        let rearrangedQuestions = [...questions]

        const dragItemContent = rearrangedQuestions.splice(dragItem.current, 1)[0]

        rearrangedQuestions.splice(dragOverItem.current, 0, dragItemContent)

        setQuestions(rearrangedQuestions)

        dragItem.current = null
        dragOverItem.current = null
    }

    const validateQuestions = () => {

        const emptyIndexes = questions
        .map((question, index) => !question.text.trim() ? index + 1 : null)
        .filter(index => index !== null)

        if(emptyIndexes.length > 0){
            setMessage({text: `Please add text for question${emptyIndexes.length > 1 ? 's ':' '}${emptyIndexes.toString()}.`, type: 'error'})
            return false
        }

        setMessage({text: null, type: null})
        return true
    }

    const saveForm = async () => {
        
        
        if(!validateQuestions()){
            window.scroll({top:0, behavior: 'smooth'})
            return;
        }
        setSavingForm(true)
        
        try{
            const response = await fetch(`${url}/forms/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questions)
            })
        
            if(!response.ok){
                setMessage({text: 'Error Saving the form.', type: 'error'})
            }

            const data = await response.json()
            setMessage({text: 'Form saved succesfully!', type: 'success'})
        }
        catch(error){
            setMessage({text: 'Error.', type: 'error'})
            console.error('Error:', error)
        }
        finally{
            setSavingForm(false)
        }
    }

    return(
        <DashboardLayout>
            <div className="flex justify-between flex-wrap w-full pb-3.5">
                <div className='flex items-center gap-2'>
                <i className='bx bx-left-arrow-alt text-3xl'></i>
                <h1 className="text-3xl font-bold mb-2 md:mb-0">Edit Form</h1>
                </div>
                    <div className='flex justify-between gap-5'>
                    <Button
                        icon='bx bx-copy'
                        content='Copy Link'
                        black={false}
                    />
                    <Button
                        icon='bx bx-save'
                        content={`${savingForm ? 'Saving...' :'Save Form'}`}
                        onClick={saveForm}
                        disabled={savingForm}
                    />
                    </div>
            </div>
            <div className='w-full flex bg-gray-100 rounded-sm p-1 mb-6'>
                    <button
                    className={`w-1/2 rounded-xs p-1 ${edit ? 'bg-white text-black' : 'text-black/60'} hover:cursor-pointer`}
                    onClick={()=>setEdit(true)}
                    >
                        Edit
                    </button>
                    <button
                    className={`w-1/2 rounded-xs p-1 ${edit ? 'text-black/60' : 'bg-white text-black'} hover:cursor-pointer`}
                    onClick={()=>setEdit(false)}
                    >
                        Preview
                    </button>
            </div>
            {message.text && (
                <div className={`${message.type==='error' ? 'text-red-600' : 'text-green-500'}`}>{message.text}</div>
                )}
            {edit && (<div className='dropZone w-full flex flex-col gap-3'>
                {questions.map((question,index)=>(
                        <QuestionCard
                            key={question.id}
                            index={index}
                            removeQuestion={removeQuestion}
                            question={question}
                            oneQuestionRemains={questions.length===1}
                            onTypeChange={changeQuestionType}
                            onTextChange={changeQuestionText}
                            onOptionChange={changeOptions}
                            handleSort={handleSort}
                            dragItem={dragItem}
                            dragOverItem={dragOverItem}
                        />
                ))}
            <div className='w-full flex justify-center'>
            <Button
                black={false}
                content='Add Question'
                icon='bx bx-plus'
                onClick={addQuestion}
            />
            </div>
            </div>)}
            {!edit && (
                <FormViewer
                questions={questions}
                />
            )}
        </DashboardLayout>
    )
}