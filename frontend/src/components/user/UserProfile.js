import { useUserData } from "../../../config/globalVariables";

//for rendering user name and related informations as required
const UserProfile = () => {
    const [userData, setUserData] = useUserData();

    return (
        <div className="userProfile" >
            <h2 style={{ color: "var(--font-color-2)" }}>User</h2>

            <h1>Hi! {userData?.name}</h1>
        </div>
    );
};

export default UserProfile;