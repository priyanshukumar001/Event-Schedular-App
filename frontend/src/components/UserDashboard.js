import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useVerify, useUserData, useSelectedDate } from '../../config/globalVariables.js';
import UserProfile from "./user/UserProfile.js";
import AvailableSlots from "./user/AvailableSlots.js";
import ScheduledSlots from "./user/ScheduledSlots.js";
import TimeScheduler from "./user/TimeScheduler.js";
import Calendar from "./user/Calendar.js";

//this is main User Dashboard component rendering all necessary informations
const UserDashboard = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [selDate, setSelDate] = useSelectedDate();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVerified) {
            navigate('/user/login');
        }
    }, [isVerified, navigate]);

    return ((!isVerified) ? <Outlet /> : ((isAdmin) ? (<div className="unauthorized"><p>You are not Authorized to access this page.</p></div>) :
        (<>
            {/* complete admin dashboard */}
            <div className="profile-calendar-group">
                <UserProfile />
                <Calendar />
                <TimeScheduler date={selDate} />
            </div>
            <div className="book-slots">
                <AvailableSlots />
                <ScheduledSlots />
            </div>
        </>))
    );
}

export default UserDashboard;