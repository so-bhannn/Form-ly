import { 
    Button,
    Navbar,
 } from "../components";

import { useLocation } from "react-router-dom";

const DashboardLayout = ({children})=>{
    const location = useLocation();
    const pathname = location.pathname;

    return(
        <div className="flex flex-col w-full h-screen box-border">
            <div className="sticky top-0 z-10">
                <Navbar/>
            </div>
            <div className="flex flex-row w-full ">
                <aside className="sm:flex flex-col justify-between bg-gray-50 min-w-70 max-w-70 h-[calc(100vh-64px)] border-r-1 border-gray-200 box-border hidden font-medium fixed overflow-y-auto">
                    <div className="px-4">
                        <a href="/dashboard" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/dashboard` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer`}> <i className='bx bx-home-alt text-2xl' ></i><h1>Dashboard</h1></a>
                        <a href="/forms" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/forms` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer`}><i className='bx bx-file text-2xl' ></i><h1>My Forms</h1></a>
                        <a href="/responses" className={`flex gap-2.5 items-center w-full rounded-lg px-2.5 py-2.5 my-2.5 text-md ${pathname===`/responses` ? 'bg-gray-100 text-black/80' : 'text-black/60'} hover:bg-gray-100 hover:text-black/80 hover:cursor-pointer`}><i className='bx bx-bar-chart-alt-2 text-2xl'></i><h1>Responses</h1></a>
                    </div>
                    <div className="flex items-center gap-3 bg-white border-1 border-b-0 border-gray-200 text-black/90 m-0.5 p-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer">
                        <span><i className='bx bxs-user-circle text-3xl text-black/70'></i></span>
                        <div>
                            <div className="text-lg">username</div>
                            <div className="text-sm text-black/70">user03@example.com</div>
                        </div>
                    </div>
                </aside>
                <div className="sm:ml-70 flex flex-col items-center w-full p-5 box-border">
                {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout