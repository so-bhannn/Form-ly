import { useState } from 'react'
import './Auth.css'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = ()=>{

	const {login} =useAuth()
	const navigate =useNavigate()
	const [showPassword,setShowPassword] = useState(false)
	const [showConfirmPassword,setShowConfirmPassword] = useState(false)
	const [credentials, setCredentials] =useState({email:'', password:'',first_name:'',last_name:''})
	const [confirmPassword, setConfirmPassword] =useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isPasswordValid, setIsPasswordValid] =useState(true)
	const [error, setError] =useState('')

	const handleInputChange =(e)=>{
		setCredentials({...credentials, [e.target.name]:e.target.value})
	}

	const handleSubmit = async(e)=>{
		e.preventDefault()
		setIsLoading(true)
		setIsPasswordValid(true)

		if(credentials.password!==confirmPassword){
			setIsPasswordValid(false)
			setIsLoading(false)
			return
		}

		try{
			const response = await axios.post('http://localhost:8000/api/v1/auth/register', credentials)
			const {user, access} = response.data

			login(user, access)

			navigate('/dashboard')

		}catch(error){
			const errorMessage = error.response?.data?.message || 'Registration Failed. Please try again.'
			setError(errorMessage)
		}finally{
			setIsLoading(false)
		}
	}

 return(
	<div className='container w-full h-screen bg-white flex items-center justify-center relative'>
		<div className='box w-lg flex flex-col items-center absolute outline-1 outline-gray-300 rounded-2xl px-20 py-10'>
			<h1 className='w-full text-6xl font-bricolage font-bold'>
				Create User
			</h1>
			<div className='w-full flex items-center gap-2 mt-3'>
				<h1 className='text-md'>Already an user?</h1>
				<Link to="/login" className='text-blue-500 hover:text-blue-600 hover:cursor-pointer'>Login</Link>
			</div>
			<form onSubmit={handleSubmit} className='w-full'>
				{error && <p className='w-full text-red-500'>{error}</p>}
				<div className='flex w-full gap-4 mt-8'>
					{/* first name */}
				<div className='input_box flex-1 relative'>
					<input
					name='first_name'
					type="text"
					value={credentials.first_name}
					onChange={handleInputChange}
					required
					className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-md py-2'
					/>
					<label 
					htmlFor=""
					className='absolute left-0 top-2 text-md text-black/60 pointer-events-none duration-200'
					>First Name</label>
				</div>
				{/* last name */}
				<div className='input_box flex-1 relative'>
					<input
					name='last_name'
					type="text"
					value={credentials.last_name}
					onChange={handleInputChange}
					required
					className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-md py-2'
					/>
					<label 
					htmlFor=""
					className='absolute left-0 top-2 text-md text-black/60 pointer-events-none duration-200'
					>Last Name</label>
					</div>
				</div>
				{/* email */}
				<div className='input_box mt-8 relative'>
					<input
					name='email'
					type="text"
					value={credentials.email}
					onChange={handleInputChange}
					required
					className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-md py-2'
					/>
					<label 
					htmlFor=""
					className='absolute left-0 top-2 text-md text-black/60 pointer-events-none duration-200'
					>Email</label>
				</div>
				{/* password */}
				<div className='input_box mt-8 relative'>
					<input
					name='password'
					type={showPassword?'text':"password"}
					value={credentials.password}
					onChange={handleInputChange}
					required
					className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-md py-2'
					/>
					<label 
					htmlFor=""
					className='absolute left-0 top-2 text-md text-black/60 pointer-events-none duration-200'
					>Password</label>
				<div className='w-full flex items-center gap-2 mt-2'>
					<input 
					type="checkbox"
					name="showPassword"
					id="showPassword"
					checked={showPassword}
					onChange={()=> setShowPassword(prev => !prev)}
					/>
					<label htmlFor="showPassword" className='select-none'>Show Password</label>
				</div>
				</div>
				{/* confirm password */}
				<div className='input_box mt-8 relative'>
					<input
					type={showConfirmPassword ? 'text': 'password'}
					value={confirmPassword}
					onChange={(e)=>setConfirmPassword(e.target.value)}
					required
					className='w-full border-b-1 border-gray-300 focus:border-gray-400 outline-none text-md py-2'
					/>
					<label 
					htmlFor=""
					className={`absolute left-0 top-2 text-md text-black/60 pointer-events-none duration-200 ${isPasswordValid ? 'text-black/60':'text-red-500'}`}
					>{isPasswordValid?'Confirm Password': 'Passwords do not match'}</label>
				<div className='w-full flex items-center gap-2 mt-2'>
					<input 
					type="checkbox" 
					name="showConfirmPassword" 
					id="showConfirmPassword"
					checked={showConfirmPassword}
					onChange={() => setShowConfirmPassword(prev => !prev)}
					/>
					<label htmlFor="showConfirmPassword" className='select-none'>Show Password</label>
				</div>
				</div>
				<button 
				type="submit"
				disabled={isLoading}
				className={`w-full text-white my-6 p-2 rounded-lg  ${isLoading ? 'bg-black/40 cursor-not-allowed' : 'bg-black/90 cursor-pointer'}`}
				>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
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

export default RegisterPage