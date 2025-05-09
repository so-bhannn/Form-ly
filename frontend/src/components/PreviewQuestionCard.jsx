import {
    CustomSelect,
} from "../components"

function PreviewQuestionCard({
    question,
}){
    const question_type = question.question_type
    return(
        <div className="w-full rounded-lg bg-white border border-gray-200 p-5">
            <div className="w-full">
                <h1 className="text-xl font-medium">{question_type}</h1>
            </div>
            <div className="w-full p-3">
                {question_type === 'SA' && (
                    <input
                    type="text"
                    placeholder="Your Answer"
                    className="w-full p-2 pl-2.5 focus:bg-gray-50 outline outline-gray-100 focus:outline-gray-200 rounded-lg"
                    />
                )}
                {question_type === 'PA' && (
                    <textarea
                    placeholder="Your Answer"
                    className="w-full p-2 pl-2.5 focus:bg-gray-50 outline outline-gray-100 focus:outline-gray-200 rounded-lg"
                    />
                )}
                {question_type === 'MC' &&
                (question.options.length !== 0
                    ? question.options.map((option, index)=> (
                    <div>
                        <input
                        type="radio"
                        value={`Option ${index+1}`}
                        name={question.id}
                        className="hover: cursor-pointer mr-3"
                        />
                        <label htmlFor={`Option ${index+1}`}>{option.text} </label>
                    </div>)
                    )
                    : (
                        <div>
                            <input
                            type="radio"
                            value="Option 1"
                            name={question.id}
                            className="hover: cursor-pointer mr-3"
                            />
                            <label htmlFor="Option 1">Option 1</label>
                        </div>
                    ))
                }
                {question_type === 'CB' &&
                (question.options.length !==0
                    ? question.options.map((option, index)=> (
                        <div>
                            <input
                            type="checkbox"
                            value={`Option ${index+1}`}
                            name={question.id}
                            className="hover: cursor-pointer mr-3"
                            />
                            <label htmlFor={`Option ${index+1}`}>{option.text} </label>
                        </div>)
                )
                    : (
                        <div>
                            <div>
                            <input
                            type="checkbox"
                            value="Option 1"
                            name={question.id}
                            className="hover: cursor-pointer mr-3"
                            />
                            <label htmlFor="Option 1">Option 1</label>
                        </div>
                        </div>
                    ))
                }
                {question_type === 'DD' &&(
                    <CustomSelect
                    options={question.options.length === 0 ? [{ id: 1, text: 'Option 1', value: 'Option 1' }] : question.options}
                    />
                )}
            </div>
        </div>
    )
}

export default PreviewQuestionCard