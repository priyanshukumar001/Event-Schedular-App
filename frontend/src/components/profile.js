import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img2 from '../../public/static/img/2.jpg';
import DropMenu from './dropmenu';


//Profile page containing user photo and logout 
const Profile = (props) => {

    const navigate = useNavigate();

    const handleClick = (e) => {
        navigate('/dashboard');
    }


    return (
        <div className='profile'>
            <img className='profile_img' src={img2} style={{ cursor: "pointer" }} onClick={handleClick} />

            <DropMenu></DropMenu>
        </div>
    )
}


export default Profile;
