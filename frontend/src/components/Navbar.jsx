import { Button } from "./index";
import { useLocation } from "react-router-dom"

const Navbar=()=>{

    const location= useLocation();
    const pathname = location.pathname;

    return(
        <div className="flex w-full min-h-16 justify-between items-center px-5 bg-white/60 backdrop-blur-md border-b-1 border-gray-200 ">
            <a href="/" className="flex gap-1 text-black/80">
                <i className='bx bx-file text-3xl'></i>
                <div className="font-bricolage font-bold text-2xl">Formly</div>
            </a>
            {pathname==='/' &&
                <div className="md:flex justify-between gap-6 hidden">
                    <a href="/" className={`font-medium text-black/60 text-sm ${pathname === '/' ? 'text-black/90 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Home </a>
                    <a href="/dashboard" className={`font-medium text-black/60 text-sm ${pathname === '/dashboard' ? 'text-black/80  underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Dashboard</a>
                    <a href="/pricing" className={`font-medium text-black/60 text-sm ${pathname === '/pricing' ? 'text-black/80 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Pricing</a>
                    <a href="/about" className={`font-medium text-black/60 text-sm ${pathname === '/about' ? 'text-black/80 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>About</a>
                </div>
            }
            {pathname === '/' &&
                <div className="flex justify-between gap-6">
                    <Button
                        content='Get Started'
                    />
                </div>
            }
            {!(pathname === '/') &&
                <a href="/user" className="flex gap-1">
                <i className='bx bxs-user-circle text-3xl'></i>
            </a>}
        </div>
    )
}

export default Navbar