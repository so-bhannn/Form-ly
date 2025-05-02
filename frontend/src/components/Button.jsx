export default function Button ({
    content,
    icon=null,
    black=true,
    scale=100,
    onClick,
    disabled,
}){
    return(
        <button
        disabled={disabled}
        onClick={onClick ? onClick : ()=>{} }
        className={`inline-flex justify-center items-center rounded-lg text-sm font-geist-button text-black/90 border-1 px-4 py-2 hover:cursor-pointer ${black ? 'border-0 bg-black text-white hover:bg-black/80' : 'border-gray-300 hover:bg-gray-100'} ${scale?`scale-${scale}`:''}`}>
            {icon && <i className={`${icon} text-xl pr-1.5`}></i>}{content}
        </button>
    )
}