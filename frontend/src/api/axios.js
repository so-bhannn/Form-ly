import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

//getAuth and setFreshToken are two functions that are passed from the App.jsx
let getAuth 
let setFreshToken

export const setAuthAccessor = (accessor)=>{
    getAuth= accessor.getAuth
    setFreshToken = accessor.setFreshToken
}

api.interceptors.request.use(
    (config)=>{
        const accessToken = getAuth()
        if(accessToken && !config._isAuthRefresh){
            config.headers['Authorization']=`Bearer ${accessToken}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

let isRefreshing = false
let  failedQueue = []

const processQueue = (error, token= null)=>{
    failedQueue.forEach(promise=>{
        if(error){
            promise.reject(error)
        }
        else{
            promise.resolve(token)
        }
    })
    failedQueue=[]
}

api.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const originalRequest = error.config

        if(error.response?.status ===401 && !originalRequest._retry && !originalRequest._isAuthRefresh){
            if(isRefreshing){
                return new Promise((resolve, reject)=>{
                    failedQueue.push({resolve,reject})
                })
                .then(token=>{
                    originalRequest.headers['Authorization']=`Bearer ${token}`
                    return axios(originalRequest)
                })
            }
            originalRequest._retry=true
            isRefreshing =true

            try{
                const response = await axios.post(`${API_URL}/auth/token/refresh`,{}, {withCredentials:true})
                const {access: newAccessToken} = response.data

                setFreshToken(newAccessToken)

                originalRequest.headers['Authorization']=`Bearer ${newAccessToken}`
                processQueue(null, newAccessToken)

                return api(originalRequest)
            }catch(refreshError){
                processQueue(refreshError, null)
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }finally{
                isRefreshing=false
            }
        }
        return Promise.reject(error)
    }
)

export default api;