import { createContext, useContext, useState } from "react";
import { sampleData } from "../src/constants";

const VerifyContext = createContext();
const Authorization = ({ children }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <VerifyContext.Provider value={{ isVerified, setIsVerified, isAdmin, setIsAdmin }}>
            {children}
        </VerifyContext.Provider>
    )
};
const useVerify = () => useContext(VerifyContext);


//creating another context for user Information

const UserDataContext = createContext();

const UserData = ({ children }) => {
    const [userData, setUserData] = useState({});

    return (
        <UserDataContext.Provider value={[userData, setUserData]} >
            {children}
        </UserDataContext.Provider>
    )
}

const useUserData = () => useContext(UserDataContext);

// creating another context for admin data

const AdminDataContext = createContext();

const AdminData = ({ children }) => {
    const [adminData, setAdminData] = useState({});

    return (
        <AdminDataContext.Provider value={[adminData, setAdminData]} >
            {children}
        </AdminDataContext.Provider>
    )
}

const useAdminData = () => useContext(AdminDataContext);

//creating context for storing selected date

const SelectedDateContext = createContext();

const SelectedDate = ({ children }) => {
    const [selDate, setSelDate] = useState();
    return (
        <SelectedDateContext.Provider value={[selDate, setSelDate]}>
            {children}
        </SelectedDateContext.Provider>
    )
};

const useSelectedDate = () => useContext(SelectedDateContext);


export { Authorization, useVerify, UserData, useUserData, AdminData, useAdminData, SelectedDate, useSelectedDate }



