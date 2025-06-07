import React from "react";
import { createBrowserRouter, Outlet } from 'react-router-dom';
import UserLogin from "./components/UserLogin.js";
import UserSignup from "./components/UserSignup.js";
import AdminLogin from "./components/AdminLogin.js";
import AdminSignup from "./components/AdminSignup.js";
import Nav from './components/nav.js';
import Error from "./components/error.js";
import Homepage from "./components/hompage.js";
import Dashboard from "./components/dashboard.js";
import { Authorization, UserData, AdminData, SelectedDate } from "../config/globalVariables.js";
import AdminDashboard from "./components/AdminDashboard.js";
import UserDashboard from "./components/UserDashboard.js";
import Header from "./components/home-details/Header.js";
import OrganizationSignup from "./components/organization/OrganizationSignup.js";
import OrganizationDashboard from "./components/organization/OrganizationDashboard.js";
import EventTypeForm from "./components/organization/EventTypeForm.js";

// main page
const Page = () => {
    return (
        <>
            {/* for accessing global variables used react createContexts and useContext defined in globalVaribles.js */}
            <Authorization>
                <SelectedDate>
                    <UserData>
                        <AdminData>
                            <div className="min-h-[100vh] bg-gradient-to-b from-blue-50 to-blue-200"   >
                                {/* <Nav ></Nav> */}
                                <Header />
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
                        element: <div className="h-[100vh] py-[30vh]"><AdminLogin /></div>,
                    },
                    {
                        path: 'signup',
                        element: <div className="h-[100vh] py-[30vh]"><AdminSignup /></div>
                    },
                ]
            },
            {
                path: 'user',
                element: <UserDashboard />,
                children: [
                    {
                        path: 'login',
                        element: <div className="h-[100vh] py-[30vh]"><UserLogin /></div>,
                    },
                    {
                        path: 'signup',
                        element: <div className="h-[100vh] py-[30vh]"><UserSignup /></div>
                    },
                ]
            },
            {
                path: 'organization',
                children: [
                    {
                        path: 'signup',
                        element: <OrganizationSignup />
                    },
                    {
                        path: 'dashboard',
                        element: <OrganizationDashboard />
                    },
                    {
                        path: 'event-types/new',
                        element: <EventTypeForm />
                    },
                    {
                        path: 'event-types/:id',
                        element: <EventTypeForm />
                    }
                ]
            }
        ],
        errorElement: <Error />,
    }
])

export default appRouter;
