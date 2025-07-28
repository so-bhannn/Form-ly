import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    ProtectedRoute,
    PublicOnlyRoute,
    RootRedirect,
} from "../components";
import {
  LoginPage,
  RegisterPage,
  Home,
  Dashboard,
  AllForms,
  FormBuilder,
} from '../pages'

const router=createBrowserRouter([
    {
        path:'/',
        element:<RootRedirect/>
    },
    {
        path:'/home',
        element:<Home/>
    },
    {
        path:'/form/edit',
        element:<FormBuilder/>
    },
    {
        element:<PublicOnlyRoute/>,
        children:[
            {
                path:'/login',
                element:<LoginPage/>
            },
            {
                path:'/register',
                element:<RegisterPage/>
            }
        ]
    },
    {
        element:<ProtectedRoute/>,
        children:[
            {
                path:'/dashboard',
                element:<Dashboard/>
            },
            {
                path:'/forms',
                element:<AllForms/>
            },
            {
                path:`/edit/:id`,
                element:<FormBuilder/>
            }
        ]
    }
])

const Routes=()=>{
    return <RouterProvider router={router}/>
}

export default Routes