import React from 'react';
import events from '../../public/static/img/events.png';
import { Link } from 'react-router-dom';
import Profile from './profile';
import { useVerify } from '../../config/globalVariables.js';

//Nav bar for profile photo and login/logout features
const Nav = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();

    return (

        <div className='nav'>
            <Link to="/">
                <h1 id='title'><img id='logo' src={events} />Events</h1>
            </Link>
            {(isVerified) ? (<Profile />) : (
                <div className='register'>
                    <Link to='/user/login'><button className='register_button'>User</button></Link>
                    <Link to='/admin/login'><button className='register_button'>Admin</button></Link>
                </div>
            )}

        </div>

    );
}

export default Nav;