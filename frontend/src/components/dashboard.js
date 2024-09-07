import { useVerify, useUserData } from "../../config/globalVariables.js";

const Dashboard = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();

    const [userData, setUserData] = useUserData();


    return (!isVerified) ? ((isAdmin) ? (<></>) : (<></>)) :
        (
            <h2 className="main_heading">Welcome {userData?.name}! </h2>
        );
}

export default Dashboard;