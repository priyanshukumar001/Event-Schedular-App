import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useVerify, useUserData, useSelectedDate } from '../../config/globalVariables.js';
import UserProfile from "./user/UserProfile";
import AvailableSlots from "./user/AvailableSlots";
import ScheduledSlots from "./user/ScheduledSlots";
import TimeScheduler from "./user/TimeScheduler";
import Calendar from "./user/Calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar as CalendarIcon, Clock } from "lucide-react";

// This is main User Dashboard component rendering all necessary informations
const UserDashboard = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [selDate, setSelDate] = useSelectedDate();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVerified) {
            navigate('/user/login');
        }
    }, [isVerified, navigate]);

    if (!isVerified) {
        return <Outlet />;
    }

    if (isAdmin) {
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
                        <User size={16} />
                        <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        <span>Schedule</span>
                    </TabsTrigger>
                    <TabsTrigger value="slots" className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Slots</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <UserProfile />
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Calendar />
                        <TimeScheduler date={selDate} />
                    </div>
                </TabsContent>

                <TabsContent value="slots" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AvailableSlots />
                        <ScheduledSlots />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserDashboard;