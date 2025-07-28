import { 
    DisplayQuestionCard
 } from "../components"

export default function FormViewer({
    form,
    questions,
}
){
    return(
        <div className="w-full md:w-3/4">
            <div className='bg-white flex flex-col h-auto lg:min-w-1/2 justify-between rounded-xl outline-1 outline-gray-200 shadow-sm box-border gap-2 overflow-hidden'>
                <span className={`w-full h-3 bg-yellow-300 opacity-50`}></span>
                <h1
                    className="w-full text-2xl md:text-4xl text-black/80 font-semibold p-2 m-3 focus:outline-0 border-b-black/40 focus:bg-gray-50 rounded-xl"
                >{form.title}</h1>
                <h1
                className='w-7/8 text-lg text-black/80 p-2 m-3 mt-0 focus:outline-0 border-b-black/40 focus:bg-gray-50 rounded-xl'
                >
                    {form.description}
                </h1>
            </div>
            <div className="flex flex-col gap-6">
                {questions.map((question) => (
                    <DisplayQuestionCard
                    key={question.question_id}
                    question={question}
                    />
                ))}
            </div>
            </div>
    )
}