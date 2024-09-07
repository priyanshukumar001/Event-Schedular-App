import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useVerify, useUserData } from "../../config/globalVariables.js";


const DropMenu = () => {
    const navigate = useNavigate();

    //accessing global values
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [userData, setUserData] = useUserData();

    //state variable to check for click event
    const [isClicked, setIsClicked] = useState(false);

    return (
        <>
            <div className="dropButton"
                onClick={(e) => {
                    const dropBox = document.getElementById('dropBox');

                    if (isClicked == true) {
                        setIsClicked(false);
                        e.target.innerHTML = '&#11163;';
                        dropBox.style.padding = '0';

                    }
                    else {
                        setIsClicked(true);
                        e.target.innerHTML = '&#11161;';
                        dropBox.style.padding = '0.5em';
                    }
                }}
            >&#11163;
            </div>

            {/* for logout feature */}
            <div className="dropBox" id="dropBox">
                {(isClicked) ? (
                    <>
                        {(isAdmin) ? (<div onClick={(e) => navigate('/admin')} className="dropOptions" >Dashboard</div>) : (<div onClick={(e) => navigate('/user')} className="dropOptions" >Dashboard</div>)}
                        <div className="dropOptions"
                            onClick={(e) => {
                                setIsVerified(false);
                                setIsAdmin(false);
                                setUserData({});
                                navigate('/');
                            }}
                        >Logout</div>
                    </>

                ) : (<></>)}
            </div >

        </>

    );
}

export default DropMenu;
