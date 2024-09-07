import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { typeAnimation } from "../../config/typeAnimation";



const Homepage = () => {
    //for navigation
    const navigate = useNavigate();

    //for rendering typing effect
    useEffect(() => {
        const heading = document.getElementById('welcome');
        const apiBox = document.getElementById('UserType');
        typeAnimation('Welcome!', 100, heading);
        apiBox.style.display = 'flex';
    }, []);




    return (
        <>

            <h2 id="welcome" className="main_heading"></h2>
            <div id='UserType' className="usersType">
                <button className="users"
                    onClick={e => {
                        navigate('/admin/login');
                    }}
                >Login as Admin</button>

                <button className="users"
                    onClick={(e) => {
                        navigate('/user/login');
                    }}
                >Login as User</button>
            </div>
            <div className="animated2" ></div>
            <div className="animated2 " style={{ animationDuration: "20s", translate: "transformY(50%)" }}></div>
        </>
    )
}

export default Homepage;