import React from 'react';
// import events from '../../public/static/img/events.png';
import { Link } from 'react-router-dom';
import Profile from './profile';
import { useVerify } from '../../config/globalVariables.js';

//Nav bar for profile photo and login/logout features
const Nav = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();

    return (

        <div className='relative top-0 z-[15] w-full flex flex-row justify-around items-center py-2 rounded-b-2xl bg-gradient-to-b from-blue-500 to-blue-800 shadow-2xl'>
            <Link to="/">
                {/* <h1 id='title'><img id='logo' src={events} />Events</h1> */}
            </Link>
            {(isVerified) ? (<Profile />) : (
                <div className='flex flex-row gap-4'>
                    <Link to='/user/login'><button className='register_button'>User</button></Link>
                    <Link to='/admin/login'><button className='register_button'>Admin</button></Link>
                </div>
            )}

        </div>

    );
}

export default Nav;