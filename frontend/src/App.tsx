import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Error from './components/error';
import Homepage from './components/hompage';
import { Authorization, UserData, AdminData, SelectedDate } from '../config/globalVariables';
// import UserDashboard from './components/UserDashboard';
import Header from './components/home-details/Header';
import OrganizationSignup from './components/organization/OrganizationSignup';
import OrganizationLogin from './components/organization/OrganizationLogin';
import OrganizationDashboard from './components/organization/OrganizationDashboard';
import EventTypeManagement from './components/organization/EventTypeManagement';
import EventTypeForm from './components/organization/EventTypeForm';
import FacilityManagement from './components/organization/FacilityManagement';
import AvailableSlotsRoute from './components/organization/AvailableSlotsRoute';
import Profile from './components/user/Profile';
import FavoritesPage from './components/user/FavoritesPage';
import EventDiscoveryPage from './components/user/EventDiscoveryPage';
import EventDetailsPage from './components/user/EventDetailsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';

// Main page component with global context providers
const Page = () => {
    return (
        <AuthProvider>
            <Authorization>
                <SelectedDate>
                    <UserData>
                        <AdminData>
                            <FavoritesProvider>
                                <CartProvider>
                                    <div className="min-h-[100vh] bg-gradient-to-b from-blue-50 to-blue-200">
                                        <Header />
                                        <Outlet />
                                    </div>
                                </CartProvider>
                            </FavoritesProvider>
                        </AdminData>
                    </UserData>
                </SelectedDate>
            </Authorization>
        </AuthProvider>
    );
};

// Create router configuration
const router = createBrowserRouter([
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
                // element: <UserDashboard />,
                children: [
                    {
                        path: 'login',
                        element: <div className="h-[100vh] py-[30vh]"><Login /></div>
                    },
                    {
                        path: 'signup',
                        element: <div className="h-[100vh] py-[30vh]"><Register /></div>
                    },
                    {
                        path: 'profile',
                        element: (
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'favorites',
                        element: (
                            <ProtectedRoute>
                                <FavoritesPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'events',
                        children: [
                            {
                                index: true,
                                element: (
                                    <ProtectedRoute>
                                        <EventDiscoveryPage />
                                    </ProtectedRoute>
                                )
                            },
                            {
                                path: ':id',
                                element: (
                                    <ProtectedRoute>
                                        <EventDetailsPage />
                                    </ProtectedRoute>
                                )
                            }
                        ]
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
                        children: [
                            {
                                index: true,
                                element: <EventTypeManagement />
                            },
                            {
                                path: 'new',
                                element: <EventTypeForm />
                            },
                            {
                                path: ':id',
                                element: <EventTypeForm />
                            },
                            {
                                path: ':eventTypeId/slots',
                                element: <AvailableSlotsRoute />
                            }
                        ]
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

export default router; 