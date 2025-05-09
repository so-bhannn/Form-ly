import { PreviewQuestionCard } from "../components"

export default function FormViewer({
    questions,
}
){
    return(
        <div className="w-full">
            {questions.map((question) => (
                <PreviewQuestionCard
                key={question.id}
                question={question}
                />
            ))}
        </div>
    )
}