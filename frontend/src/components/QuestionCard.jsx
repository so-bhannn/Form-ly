import {
    Button,
    OptionList,
    CustomSelect,
} from '../components';
import { useCallback, useState, memo, useEffect, useRef } from "react";

const QuestionCard = memo(({
    removeQuestion,
    question,
    index,
    oneQuestionRemains,
    onTypeChange,
    onTextChange,
    onOptionChange,
    handleSort,
    dragItem,
    dragOverItem,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragHandleRef= useRef()
    const cardRef = useRef(null);

    
    const options = [
        { value: 'SA', text: 'Short Question' },
        { value: 'PA', text: 'Paragraph' },
        { value: 'MC', text: 'Multiple Choice' },
        { value: 'CB', text: 'Checkboxes' },
        { value: 'DD', text: 'Drop-down' },
    ];
    const [isRequired, setIsRequired] = useState(false);
    const [question_type, setQuestion_type] = useState(question.question_type);
    const [nextId, setNextId] = useState(2);
    const [multipleOptions, setMultipleOptions] = useState(question.options.length
        ? question.options
        : [{ id: 1, text: 'Option 1', value: 'Option 1' }]
    );
 
    const addOption = useCallback(() => {
        const newOptions = [...multipleOptions, { id: nextId, text: `Option ${nextId}`, value: `Option ${nextId}` }]
        setMultipleOptions(newOptions);
        setNextId(nextId + 1);
        onOptionChange && onOptionChange(question.id, newOptions)
    }, [multipleOptions, nextId, onOptionChange, question]);

    const removeOption = useCallback((id) => {
        if (multipleOptions.length <= 1) return;
        const newOptions = multipleOptions.filter(option => option.id !== id)
        setMultipleOptions(newOptions);
        onOptionChange && onOptionChange(question.id, newOptions)
    }, [multipleOptions, onOptionChange, question]);

    const updateOption = useCallback((id, text) => {
        const newOptions = multipleOptions.map(option =>
            option.id === id ? { ...option, text } : option)
        setMultipleOptions(newOptions);
        onOptionChange && onOptionChange(question.id, newOptions)
    }, [multipleOptions,onOptionChange,question]);

    const handleTypeChange = (value) => {
        setQuestion_type(value);
        if (onTypeChange) onTypeChange(question.id, value);
    };

    const handleDragStart = (e) => {
        if(cardRef.current){
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", question.id.toString())

            const crt = cardRef.current.cloneNode(true)
            crt.style.opacity="1"
            crt.style.position="absolute"
            crt.style.top="-1000px"
            document.body.appendChild(crt)

            const cardRect=cardRef.current.getBoundingClientRect()
            const dragHandleRect=dragHandleRef.current.getBoundingClientRect()
            const xOffset = (dragHandleRect.width/2)
            const yOffset = e.clientY-cardRect.top
            e.dataTransfer.setDragImage(crt,xOffset,yOffset)
            setTimeout(()=> document.body.removeChild(crt),0)
        }
        dragItem.current = index
        setIsDragging(true)
        document.documentElement.classList.add('dragging-within-zone')
    }

    const handleDragEnd = () => {
        setIsDragging(false)
        document.documentElement.classList.remove('dragging-within-zone')
        document.documentElement.classList.remove('dragging-outside-zone')

        if(dragItem.current !== null && dragOverItem.current !== null){
            handleSort()
        }
    }

    useEffect(() => {
        const handleDragOver = (e) => {
            if (isDragging) {
                e.preventDefault();
                const dropZone = document.querySelector('.dropZone')
                if(!dropZone) return;

                const dropZoneRect = dropZone.getBoundingClientRect()
                const isWithinDropZone = 
                    e.clientY>=dropZoneRect.top &&
                    e.clientY<=dropZoneRect.bottom &&
                    e.clientX>=dropZoneRect.left &&
                    e.clientX<=dropZoneRect.right;

                if(isWithinDropZone){
                    document.documentElement.classList.add('dragging-within-zone')
                    document.documentElement.classList.remove('dragging-outside-zone')
                }
                else{
                    document.documentElement.classList.remove('dragging-within-zone')
                    document.documentElement.classList.add('dragging-outside-zone')
                }
            }
        };
        
        document.addEventListener('dragover', handleDragOver);
        return () => {
            document.removeEventListener('dragover', handleDragOver);
            document.documentElement.classList.remove('dragging-within-zone')
            document.documentElement.classList.remove('dragging-outside-zone')
        };
    }, [isDragging]);

    return (
        <>
            <div
                ref={cardRef}
                className={`flex w-full rounded-lg bg-white border border-gray-200 ${isDragging ? 'opacity-0' : 'opacity-100'}`}
                onDragEnter={(e) => (dragOverItem.current = index) }
            >
                {/* Drag handle */}
                <div 
                ref={dragHandleRef}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`opacity-50 flex items-center justify-center pl-2 cursor-grab active:cursor-grabbing ${isDragging?'dragging':''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
                        <circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
                    </svg>
                </div>

                {/* Question content */}
                <div className="w-full p-5">
                    <div className="flex justify-between">
                        <input
                            type="text"
                            placeholder="Question"
                            value={question.text}
                            required
                            onChange={(e)=> onTextChange && onTextChange(question.id,e.target.value) }
                            className="w-full max-w-4xl flex-1 text-xl font-medium p-2 focus:outline-0 border-b-black/40 focus:bg-gray-50"
                        />

                        {/* Controls */}
                        <div className={`flex gap-2 items-center`}>
                            {/* Required toggle */}
                            <div className="flex items-center ml-2">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isRequired}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer ${isRequired ? 'bg-black/80' : 'bg-gray-200'}`}
                                    onClick={() => setIsRequired(!isRequired)}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition transform ${isRequired ? 'translate-x-5' : 'translate-x-1'}`}></span>
                                </button>
                                <label className="text-sm font-medium ml-2">Required</label>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={() => removeQuestion(question.id)}
                                disabled={oneQuestionRemains}
                                className={`w-9 h-9 inline-flex justify-center items-center rounded-lg ${oneQuestionRemains ? 'cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={oneQuestionRemains ? "gray" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Question type selector */}
                    <div className={`mt-3`}>
                        <CustomSelect
                            onChange={handleTypeChange}
                            options={options}
                            defaultValue={options.find(option => option.value === question_type) ?? options[0]}
                        />
                    </div>

                    {/* Question type specific inputs */}
                    <div className={`ml-5 mt-5`}>
                        {question_type === 'SA' && (
                            <input
                                type="text"
                                placeholder='Short Answer text'
                                disabled
                                className={`w-full p-2.5 rounded-lg outline outline-gray-100 cursor-not-allowed`}
                            />
                        )}

                        {question_type === 'PA' && (
                            <textarea
                                placeholder='Long Answer text'
                                disabled
                                className={`min-h-20 w-full p-2.5 rounded-lg outline outline-gray-100 cursor-not-allowed`}
                            />
                        )}

                        {['MC', 'CB', 'DD'].includes(question_type) && (
                            <OptionList
                                options={multipleOptions}
                                type={question_type}
                                addOption={addOption}
                                updateOption={updateOption}
                                removeOption={removeOption}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});

export default QuestionCard;