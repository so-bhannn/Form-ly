import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import {
    Button,
    QuestionCard
} from '../components'
import { DashboardLayout } from '../layouts'
import { FormViewer,
        AutoResizingTextArea,
 } from '../components'
import {useForms} from '../hooks'
import api from '../api/axios'

export default function FormBuilder(){
    const navigate = useNavigate()
    const {id}=useParams()
    const {forms,setForms}=useForms()
    const [form, setForm] =useState({
        title:"Untitled Form",
        description: ""
    })
    const[questions,setQuestions]=useState([
        {question_id:1, text:"", question_type:"SA", is_required: false},
    ])
    const [nextId,setNextId]=useState(2)
    const dragItem = useRef(null)
    const dragOverItem = useRef(null)

    const [savingForm, setSavingForm] = useState(false)
    const [message, setMessage] = useState({text: null, type: null})

    const [edit, setEdit] = useState(true)

    useEffect(()=>{
        if(id && forms.length>0){
            const currentForm = forms.find(form => form.form_id===id)
            setForm(currentForm)
            setQuestions(currentForm.questions)
        }
    },[id,forms])

    const addQuestion=()=>{
        const question_type=questions.length>0
        ? questions[questions.length-1].question_type
        : "SA";

        setQuestions([...questions,{question_id:nextId, text:"", question_type:question_type, is_required:false, options:[]}])
        setNextId(nextId+1)
    }

    const removeQuestion=(id)=>{
        if(questions.length<=1) return;
        setQuestions(questions.filter(question=>question.question_id!==id))
    }

    const updateQuestion=useCallback((id, property, value)=>{
        setQuestions(questions=>questions.map(question=>
            question.question_id===id
            ? {...question, [property]:value}
            : question
        ))
    },[])

    const onTextChange=(parameter,value)=>{
        setForm({
            ...form,
            [parameter]:value,
        })
    }

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

    const saveForm = async()=>{
        if(!validateQuestions()){
            window.scroll({top:0, behavior:'smooth'})
            return
        }
        setSavingForm(true)

        const validatedQuestions= questions.map((question,index)=>{
            if(Array.isArray(question.options)){
                question.options=question.options.map((option,optionIndex)=>({
                    ...option,
                    order:optionIndex
                }))
            }
            return {
                ...question,
                order: index
            }
        })

        form['questions']=validatedQuestions

        try{
            const response=await api.post('/forms/', form)
            setMessage({text:'Form saved successfully', type:'success'})
            setForms(form)
        }
        catch(error){
            const errorMessage= error.response?.data?.detail || 'An error occured while saving the form.'
            setMessage({text:String(errorMessage), type:'error'})
            }
        finally{
            setSavingForm(false)
        }
    }

    return(
        <DashboardLayout>
            <div className="flex justify-between flex-wrap w-full pb-3.5">
                <div className='flex items-center gap-2'>
                <button onClick={() => navigate(-1)} className='flex justify-center items-center rounded-lg p-1 hover:bg-gray-100 cursor-pointer'><i className='bx bx-left-arrow-alt text-3xl'></i></button>
                <h1 className="text-3xl font-bold mb-2 md:mb-0">{`${id ? 'Edit': 'Create'} Form`}</h1>
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
            <div className='w-full md:w-3/4 flex bg-gray-200 rounded-xl p-1.5 mb-6 relative overflow-hidden'>
             <div 
                    className='absolute bg-white h-3/4 z-0 rounded-lg transition-all duration-300 ease-in-out'
                    style={{ 
                        transform: edit ? 'translateX(0)' : 'translateX(100%)',
                        width: 'calc(50% - 5px)'
                    }}
                ></div>
                    <button
                    className={`w-1/2 rounded-xs p-1 z-10 transition-colors duration-300 ${edit ? 'text-black' : 'text-black/60'} hover:cursor-pointer`}
                    onClick={()=>setEdit(true)}
                    >
                        Edit
                    </button>
                    <button
                    className={`w-1/2 rounded-xs p-1 z-10 transition-colors duration-300 ${edit ? 'text-black/60' : 'text-black'} hover:cursor-pointer`}
                    onClick={()=>setEdit(false)}
                    >
                        Preview
                    </button>
            </div>
            {message.text && (
                <div className={`${message.type==='error' ? 'text-red-600' : 'text-green-500'}`}>{message.text}</div>
                )}
            {}
            {edit && (
                <div className='dropZone w-full md:w-3/4 flex flex-col gap-3'>
                    <div className='bg-white flex flex-col h-auto lg:min-w-1/2 justify-between rounded-xl outline-1 outline-gray-200 shadow-sm box-border gap-2 overflow-hidden'>
                        <span className={`w-full h-3 bg-yellow-300 opacity-50`}></span>
                        <AutoResizingTextArea
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e)=>{onTextChange('title',e.target.value)}}
                            required
                            className="w-1/2 max-w-4xl text-2xl md:text-4xl text-black/80 font-semibold p-2 m-3 focus:outline-0 border-b-black/40 focus:bg-gray-50 rounded-xl"
                        />
                        <AutoResizingTextArea
                        type="text"
                        placeholder='Description'
                        value={form.description}
                        onChange={(e)=>{onTextChange('description',e.target.value)}}
                        className='w-7/8 text-lg text-black/80 p-2 m-3 mt-0 focus:outline-0 border-b-black/40 focus:bg-gray-50 rounded-xl'
                        />
                    </div>
                {questions.map((question,index)=>(
                        <QuestionCard
                            key={question.question_id}
                            index={index}
                            removeQuestion={removeQuestion}
                            question={question}
                            isRequired={question.is_required}
                            oneQuestionRemains={questions.length===1}
                            onTypeChange={(id, value)=> updateQuestion(id, 'question_type', value)}
                            onTextChange={(id, value)=> updateQuestion(id, 'text', value)}
                            onOptionChange={(id, value)=> updateQuestion(id,'options', value)}
                            onRequiredChange={(id,value)=> updateQuestion(id, 'is_required', value)}
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
            {!edit && questions[0].text &&(
                <FormViewer
                questions={questions}
                form={form}
                />
            )}
        </DashboardLayout>
    )
}