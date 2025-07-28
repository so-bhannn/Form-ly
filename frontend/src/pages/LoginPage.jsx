import { useState } from 'react'
import './Auth.css'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import api from '../api/axios'

const LoginPage=()=>{

  const {login} =useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] =useState(false)
  const [credentials, setCredentials] =useState({email:'', password:''})
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError] =useState('')

  const handleInputChange =(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setIsLoading(true)

    try{
      const response = await api.post('/auth/login', credentials)

      const {user, access} = response.data

      login(user, access)

      navigate('/dashboard')

    }catch (error){
      const errorMessage = error.response?.data?.message || 'Failed to Login. Please check your credentials'
      setError(errorMessage)
    }finally{
      setIsLoading(false)
    }
  }

 return(
  <div className='container w-full h-screen bg-white flex justify-center items-center relative'>
   <div className='box w-lg flex flex-col items-center absolute outline-1 outline-gray-300 rounded-2xl px-20 py-10'>
    <h1 className='w-full text-6xl font-bricolage font-bold'>Welcome Back</h1>
    <div className='w-full flex items-center gap-2 mt-3'>
     <h1 className='text-md'>New User?</h1>
     <Link to="/register" className='text-blue-500 hover:blue-700 hover:cursor-pointer'>Register</Link>
    </div>
    <form onSubmit={handleSubmit} className='w-full'>
      {error && <p className='w-full text-red-500'> {error}</p>}
      {/* Email input box */}
     <div className='input_box w-full mt-10 relative'>
      <input
      name='email'
      type="email"
      value={credentials.email}
      onChange={handleInputChange}
      required
      className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-lg py-2'
      />
      <label 
      htmlFor=""
      className='absolute left-0 text-md
       text-black/60 top-2 pointer-events-none duration-200'
      >Email</label>
     </div>
     {/* Passwrod input box */}
     <div className='input_box w-full mt-8 relative'>
      <input
      name='password'
      type= {showPassword ? "text" : "password"}
      value={credentials.password}
      onChange={handleInputChange}
      required
      className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-lg py-2'
      />
      <label 
      htmlFor=""
      className='absolute left-0 text-md text-black/60 top-2 pointer-events-none duration-200'
      >Password</label>
      <div className='flex items-center gap-2 mt-2'>
        <input 
        type="checkbox" 
        name="showPassword" 
        id="showPassword"
        checked={showPassword}
        onChange={()=> setShowPassword(prev => !prev)}
        />
        <label htmlFor="showPassword" className="text-sm select-none">Show Password</label>
      </div>
     </div>
     {/* Sign In button */}
      <button 
      type="submit"
      disabled={isLoading}
      className={`w-full  text-white my-6 p-2 rounded-lg ${isLoading ? 'bg-black/40 cursor-not-allowed' : 'bg-black/90 cursor-pointer'}`}>
       {isLoading? 'Signing In...': 'Sign In'}
       </button>
    </form>
    <div className='w-full flex items-center'>
     <div className='flex-grow h-0.25 bg-gray-300'></div>
     <span className='px-2'>or Sign In with</span>
     <div className='flex-grow h-0.25 bg-gray-300'></div>
    </div>
   <div className='w-full mt-5'>
    <div className='flex items-center justify-center gap-5 text-2xl hover:cursor-pointer p-2  outline-1 outline-gray-300 rounded-lg'><i class='bx bxl-google'></i><p className='text-lg'>Google</p></div>
   </div>
   </div>
  </div>
 )
}

export default LoginPage