import {
    Navbar,
    Button,
} from '../components'

import { useNavigate } from 'react-router-dom'

const Home = ()=>{

    const navigate = useNavigate();
    const openEdit = () => {
        navigate('/form/edit');
    };
    const openTemplates = () => {
        navigate('/templates');
    }

    return(
    <div className='flex flex-col w-full h-screen'>
        <div className='sticky top-0 z-10'>
        <Navbar/>
        </div>
        <div className='px-10 md:p-0'>
            <div className="flex flex-wrap justify-self-center items-center w-3/4 lg:flex-nowrap md:px-10 px-0 py-5">
                <div className='md:mr-10'>
                    <h1 className='text-5xl md:text-7xl font-bricolage font-bold'>Don't Make Excuses.</h1>
                    <h1 className='text-5xl md:text-7xl font-bricolage font-bold'>Make Beatiful Forms in minutes.</h1>
                    <p className='text-lg md:text-xl text-black/60 my-3'>Formly makes it easy to create, share, and analyze forms. Collect responses, gather feedback, and make better decisions.</p>
                    <div className='flex flex-wrap items-center gap-5'>
                        <Button
                            content='Create'
                            icon='bx bx-right-arrow-alt'
                            onClick={openEdit}
                        />
                        <Button
                            content='Explore Templates'
                            black={false}
                            onClick={openTemplates}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 my-10 aspect-square rounded-lg overflow-hidden">
                    <img loading='lazy' className='w-full h-full' src="https://kzmolc428s45p63rqfkc.lite.vusercontent.net/placeholder.svg?height=550&width=550" alt="Form illustration" />
                </div>
            </div>
            <div className='text-center flex flex-col justify-between items-center md:bg-gray-50 md:p-15'>
                <div>
                    <h1 className='text-center text-3xl md:text-5xl font-bricolage font-bold'>Features that make form creation easy.</h1>
                    <p className='text-center md:text-xl text-black/60'>Everything you need to create professional forms and collect responses efficiently.</p>
                </div>
                <div className='mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 py-12'>
                    <div className='flex flex-col items-center outline-1 outline-gray-200 p-6 space-y-2 rounded-lg shadow-sm'>
                        <div className='rounded-full bg-gray-200 py-3 px-3.5'><i className='bx bxs-edit-alt text-4xl'></i></div>
                        <h1 className='text-2xl font-bricolage font-bold'>Modern Form Builder</h1>
                        <p className='text-center text-black/60'>Drag and drop interface to create forms with multiple question types in minutes.</p>
                    </div>
                    <div className='flex flex-col items-center outline-1 outline-gray-200 p-6 space-y-2 rounded-lg shadow-sm'>
                        <div className='rounded-full bg-gray-200 py-3 px-3.5'><i className='bx bx-bar-chart-alt-2 text-4xl'></i></div>
                        <h1 className='text-2xl font-bricolage font-bold'>Response Collection</h1>
                        <p className='text-center text-black/60'>Collect and organize responses in real-time with automatic data visualization.</p>
                    </div>
                    <div className='flex flex-col items-center outline-1 outline-gray-200 p-6 space-y-2 rounded-lg shadow-sm'>
                        <div className='rounded-full bg-gray-200 py-3 px-3.5'><i className='bx bx-check-circle text-4xl'></i></div>
                        <h1 className='text-2xl font-bricolage font-bold'>Form Customization</h1>
                        <p className='text-center text-black/60'>Customize the look and feel of your forms with themes, colors, and branding options.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center gap-1.5 w-full h-16 bottom-0 p-5 border-gray-200 border-t '>
            <a href="/" className="flex gap-1 text-black/80">
                <i className='bx bx-file text-3xl'></i>
                <div className="font-bricolage font-bold text-2xl">Formly</div>
            </a>
            <p className='text-black/60'>
                © 2025 Formly. All rights reserved.
            </p>
            <div>
            <a href="#" className='text-black/60 hover:underline hover:underline-offset-2'>Terms</a>
            <a href="#" className='text-black/60 px-2 hover:underline hover:underline-offset-2'>Privacy</a>
            </div>
        </div>
    </div>
    )
}
export default Home