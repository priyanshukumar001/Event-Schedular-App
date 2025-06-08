import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import Nav from './components/nav';
import Error from './components/error';
import Homepage from './components/hompage';
import Dashboard from './components/dashboard';
import { Authorization, UserData, AdminData, SelectedDate } from '../config/globalVariables';
import UserDashboard from './components/UserDashboard';
import Header from './components/home-details/Header';
import OrganizationSignup from './components/organization/OrganizationSignup';
import OrganizationLogin from './components/organization/OrganizationLogin';
import OrganizationDashboard from './components/organization/OrganizationDashboard';
import EventTypeManagement from './components/organization/EventTypeManagement';
import EventTypeForm from './components/organization/EventTypeForm';
import FacilityManagement from './components/organization/FacilityManagement';

// Main page component with global context providers
const Page = () => {
    return (
        <Authorization>
            <SelectedDate>
                <UserData>
                    <AdminData>
                        <div className="min-h-[100vh] bg-gradient-to-b from-blue-50 to-blue-200">
                            <Header />
                            <Outlet />
                        </div>
                    </AdminData>
                </UserData>
            </SelectedDate>
        </Authorization>
    );
};

// Create router configuration
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
                path: 'user',
                element: <UserDashboard />,
                children: [
                    {
                        path: 'login',
                        element: <div className="h-[100vh] py-[30vh]"><UserLogin /></div>
                    },
                    {
                        path: 'signup',
                        element: <div className="h-[100vh] py-[30vh]"><UserSignup /></div>
                    }
                ]
            },
            {
                path: 'organization',
                children: [
                    {
                        path: 'login',
                        element: <div className="h-[100vh] py-[30vh]"><OrganizationLogin /></div>
                    },
                    {
                        path: 'signup',
                        element: <OrganizationSignup />
                    },
                    {
                        path: 'dashboard',
                        element: <OrganizationDashboard />
                    },
                    {
                        path: 'event-types',
                        element: <EventTypeManagement />
                    },
                    {
                        path: 'event-types/new',
                        element: <EventTypeForm />
                    },
                    {
                        path: 'event-types/:id',
                        element: <EventTypeForm />
                    },
                    {
                        path: 'facilities',
                        element: <FacilityManagement />
                    }
                ]
            }
        ],
        errorElement: <Error />
    }
]);

export default appRouter; 