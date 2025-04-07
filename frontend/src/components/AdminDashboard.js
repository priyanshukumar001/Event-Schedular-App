import { useNavigate, Outlet } from "react-router-dom";
import { useUserData, useVerify } from "../../config/globalVariables";
import { useEffect } from "react";
import AdminProfile from "./admin/AdminProfile";
import UpcomingSessions from "./admin/UpcomingSessions";
import UserList from "./admin/UserList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Calendar, Users } from "lucide-react";

const AdminDashboard = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVerified) {
            navigate('/admin/login');
        }
    }, [isVerified, navigate]);

    if (!isVerified) {
        return <Outlet />;
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="p-8 rounded-lg shadow-lg bg-card text-card-foreground max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center mb-4">Unauthorized Access</h1>
                    <p className="text-center">You are not authorized to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <UserCircle size={16} />
                        <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Sessions</span>
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Users</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <AdminProfile />
                </TabsContent>

                <TabsContent value="sessions" className="mt-6">
                    <UpcomingSessions />
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <UserList />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;