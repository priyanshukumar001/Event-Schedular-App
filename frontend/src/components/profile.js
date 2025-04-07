import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img2 from '@/../public/static/img/2.jpg';
import DropMenu from './dropmenu';


//Profile page containing user photo and logout 
const Profile = (props) => {

    const navigate = useNavigate();

    const handleClick = (e) => {
        navigate('/dashboard');
    }


    return (
        <div className='profile'>
            <img className='profile_img' src={"https://static.vecteezy.com/system/resources/thumbnails/035/857/779/small/people-face-avatar-icon-cartoon-character-png.png"} style={{ cursor: "pointer" }} onClick={handleClick} />

            <DropMenu></DropMenu>
        </div>
    )
}


export default Profile;
