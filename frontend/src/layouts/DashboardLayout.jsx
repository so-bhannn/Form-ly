import { 
    Button,
    Navbar,
 } from "../components";

import { useLocation,Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = ({children,pageName})=>{
    const location = useLocation();
    const pathname = location.pathname;
    const {user}= useAuth()
    const navigate = useNavigate()

    const openCreateForm = ()=>{
        navigate('/form/edit')
    }
    const openSignUp=()=>{
        navigate('/register')
    }

    return(
        <div className="flex flex-col w-full h-screen box-border">
            <div className="sticky top-0 z-10">
                <Navbar/>
            </div>
            <div className="flex flex-row w-full ">
                <aside className="sm:flex flex-col justify-between min-w-70 max-w-70 h-[calc(100vh-64px)] border-r-1 border-gray-200 box-border hidden font-medium fixed overflow-y-auto">
                    <div className="px-4">
                        <Link to="/dashboard" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/dashboard` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer hover:translate-x-1 transition-all duration-300 ease-in-out`}> <i className='bx bx-home-alt text-2xl' ></i><h1>Dashboard</h1></Link>
                        <Link to="/forms" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/forms` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer hover:translate-x-1 transition-all duration-300 ease-in-out`}><i className='bx bx-file text-2xl' ></i><h1>My Forms</h1></Link>
                        <Link to="/responses" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/responses` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer hover:translate-x-1 transition-all duration-300 ease-in-out`}><i className='bx bx-bar-chart-alt-2 text-2xl'></i><h1>Responses</h1></Link>
                        <Link to="/templates" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/templates` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer hover:translate-x-1 transition-all duration-300 ease-in-out`}><i className='bx bxs-file-image text-2xl'></i><h1>Templates</h1></Link>
                    </div>
                    
                    {user && (
                        <div className="flex items-center gap-3 bg-white border-1 border-b-0 border-gray-200 text-black/90 m-0.5 p-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                        <span><i className='bx bxs-user-circle text-3xl text-black/70'></i></span>
                            <div>
                                <div className="text-lg">{user.first_name} {user.last_name}</div>
                                <div className="text-sm text-black/70">{user.email}</div>
                            </div>
                    </div>
                    )}
                        {!user && (
                            <div className="w-full flex justify-between items-center p-3 bg-white border-1 border-b-0 border-gray-200 rounded-lg">
                                <p className="text-md text-black/80 font-semibold w-25 leading-4 ">Get Started with Formly.</p>
                                <Button
                                content={'Sign Up for free'}
                                onClick={openSignUp}
                                black={true}
                                />
                            </div>
                        )}
                </aside>

                <div className="bg-gray-50 sm:ml-70 flex flex-col items-center w-full min-h-screen p-5 box-border">
                    {pageName && (
                        <div className="flex justify-between flex-wrap w-full pb-3.5">
                            <h1 className="text-4xl font-bold mb-2 md:mb-0">{pageName}</h1>
                            <Button
                                icon='bx bx-plus'
                                content='Create Form'
                                onClick={openCreateForm}
                            />
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout