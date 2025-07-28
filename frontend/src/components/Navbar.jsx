import { useAuth } from "../hooks/useAuth";
import { Button } from "./index";
import { useLocation, useNavigate } from "react-router-dom"

const Navbar=()=>{

    const location= useLocation();
    const pathname = location.pathname;

    const {accessToken, logout} =useAuth()

    const navigate = useNavigate()
    const openEdit=()=>{
        navigate('/form/edit')
    }

    return(
        <div className="flex w-full min-h-16 justify-between items-center px-5 bg-white/60 backdrop-blur-md border-b-1 border-gray-200 ">
            <a href="/" className="flex gap-1 text-black/80">
                <i className='bx bx-file text-3xl'></i>
                <div className="font-bricolage font-bold text-2xl">Formly</div>
            </a>
            {pathname==='/home' &&
                <div className="md:flex justify-between gap-6 hidden">
                    <a href="/" className={`font-medium text-black/60 text-sm ${pathname === '/home' ? 'text-black/90 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Home </a>
                    <a href="/dashboard" className={`font-medium text-black/60 text-sm ${pathname === '/dashboard' ? 'text-black/80  underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Dashboard</a>
                    <a href="/pricing" className={`font-medium text-black/60 text-sm ${pathname === '/pricing' ? 'text-black/80 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>Pricing</a>
                    <a href="/about" className={`font-medium text-black/60 text-sm ${pathname === '/about' ? 'text-black/80 underline-offset-8 underline' : '' } hover:text-black/80 hover:cursor-pointer`}>About</a>
                </div>
            }
            {pathname==='/home' && (
                <Button
                    onClick={openEdit}
                    content='Get Started'
                />
            )}
            {accessToken &&
                <Button
                    content='Logout'
                    onClick={logout}
                />
            }
        </div>
    )
}

export default Navbar