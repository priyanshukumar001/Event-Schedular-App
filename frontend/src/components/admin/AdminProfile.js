import { useAdminData } from "../../../config/globalVariables";

//for rendering admin related information
const AdminProfile = () => {
    const [adminData, setAdminData] = useAdminData();

    return (
        <div className="adminProfile" >
            <h1 style={{ textAlign: "left", paddingLeft: "1em" }}>Hi! {adminData?.name}</h1>
        </div>
    );
};

export default AdminProfile;