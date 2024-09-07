import { useNavigate, Outlet } from "react-router-dom";
import { useVerify, useUserData } from "../../config/globalVariables.js";
import { useEffect } from "react";
import AdminProfile from "./admin/AdminProfile.js";
import UpcomingSessions from "./admin/UpcomingSessions.js";
import UserList from "./admin/UserList.js";


const AdminDashboard = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVerified) {
            navigate('/admin/login');
        }
    }, [isVerified, navigate]);

    return ((!isVerified) ? <Outlet /> : ((!isAdmin) ? (<div className="unauthorized"><p>You are not Authorized to access this page.</p></div>) :
        (<div className="adminPanel">
            {/* complete admin dashboard */}
            <h2 style={{ color: "white" }}>Admin</h2>
            <AdminProfile />
            <UpcomingSessions />
            <UserList />
        </div>))
    );
}

export default AdminDashboard;