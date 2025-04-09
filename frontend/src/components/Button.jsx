export default function Button ({
    content,
    black=true,
}){
    return(
        <button className={`rounded-lg text-sm font-geist-button text-black/90 border-1 px-4 py-2 hover:cursor-pointer ${black ? 'border-0 bg-black text-white hover:bg-black/80' : 'border-gray-300 hover:bg-gray-100'}`}>
            {content}
        </button>
    )
}