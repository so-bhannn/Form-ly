const Navbar=()=>{
    return(
        <div className="flex w-full min-h-16 justify-between items-center px-25 border-b-1 border-gray-200">
            <a href="/dashboard" className="flex gap-1 text-black/80">
                <i class='bx bx-file text-3xl' undefined></i>
                <div className="font-bricolage font-bold text-2xl">Formly</div>
            </a>
            <a href="/user" className="flex gap-1">
                <i class='bx bxs-user-circle text-3xl'></i>
            </a>
        </div>
    )
}

export default Navbar