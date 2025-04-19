import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
    Button,
    QuestionCard
} from '../components'
import { DashboardLayout } from '../layouts'
export default function FormBuilder(){

    const[questions,setQuestions]=useState([
        {id:uuidv4(), text:"", question_type:"DD", is_required:"", order:1, options:[]},
    ])

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
                        content='Save Form'
                    />
                    </div>
            </div>
            <div className='w-full flex flex-col gap-3'>
                {questions.map((question)=>{
                return (
                        <QuestionCard
                            key={question.id}
                            removeQuestion={removeQuestion}
                            question={question}
                            oneQuestionRemains={questions.length===1}
                        />
                )})}
            <div className='w-full flex justify-center'>
            <Button
                black={false}
                content='Add Question'
                icon='bx bx-plus'
                onClick={addQuestion}
            />
            </div>
            </div>
        </DashboardLayout>
    )
}