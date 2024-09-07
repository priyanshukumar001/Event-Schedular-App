import React from "react";
import { createBrowserRouter, Outlet } from 'react-router-dom';
import UserLogin from "./components/UserLogin.js";
import UserSignup from "./components/UserSignup.js";
import AdminLogin from "./components/AdminLogin.js";
import AdminSignup from "./components/AdminSignup.js";
import Nav from './components/nav';
import Error from "./components/error";
import Homepage from "./components/hompage";
import Dashboard from "./components/dashboard";
import { Authorization, UserData, AdminData, SelectedDate } from "../config/globalVariables";
import AdminDashboard from "./components/AdminDashboard.js";
import UserDashboard from "./components/UserDashboard.js";


// main page
const Page = () => {
    return (
        <>
            {/* for accessing global variables used react createContexts and useContext defined in globalVaribles.js */}
            <Authorization>
                <SelectedDate>
                    <UserData>
                        <AdminData>
                            <div id="animationBody"  >
                                <Nav ></Nav>
                                <Outlet />
                            </div>
                        </AdminData>
                    </UserData>
                </SelectedDate>
            </Authorization>

        </>
    );
}


// used createBrowserRouter for routing to different components
const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Page />,
        children: [
            {
                path: '/',
                element: <Homepage />
            },
            {
                path: 'admin',
                element: <AdminDashboard />,
                children: [
                    {
                        path: 'login',
                        element: <AdminLogin />,
                    },
                    {
                        path: 'signup',
                        element: <AdminSignup />
                    },
                ]
            },
            {
                path: 'user',
                element: <UserDashboard />,
                children: [
                    {
                        path: 'login',
                        element: <UserLogin />,
                    },
                    {
                        path: 'signup',
                        element: <UserSignup />
                    },
                ]
            },

        ],
        errorElement: <Error />,
    }
])

export default appRouter;
