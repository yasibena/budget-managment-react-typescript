import { SignIn } from './pages/SignIn'
import { SignUp } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { Wallets } from "./pages/Wallet"
import { Budgets } from "./pages/Budgets"
import { Goals } from "./pages/Goals"
import { Setting } from "./pages/Setting"
import { Error } from './pages/Error'
import { User } from './pages/User'
import { createBrowserRouter } from "react-router-dom"
import { Expenses } from './pages/Expenses'

export const router = createBrowserRouter([
    {
        path: '/signup',
        element: <SignUp />,
        errorElement: <Error />,
    },
    {
        path: '/',
        element: <SignIn />,
        errorElement: <Error />,
    },
    {
        path: '/dashboard/wallet',
        element: <Wallets />,
        errorElement: <Error />
    },
    {
        path: '/dashboard/budget',
        element: <Budgets />,
        errorElement: <Error />
    },
    {
        path: '/dashboard/goals',
        element: <Goals />,
        errorElement: <Error />
    },
    {
        path: '/dashboard/setting',
        element: <Setting />,
        errorElement: <Error />
    },
    {
        path: '/dashboard/user',
        element: <User />,
        errorElement: <Error />
    },
    {
        path: '/dashboard/Analyst',
        element: <Expenses />,
        errorElement: <Error />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        errorElement: <Error />,
    },
])
