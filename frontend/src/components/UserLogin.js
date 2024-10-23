import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useVerify, useUserData } from '../../config/globalVariables.js';
import { user } from '../constants.js';


const UserLogin = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useUserData();

    //submit function for login authentication
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = document.getElementById('login_error')
        if (email !== '') {
            try {

                const response = await fetch(`${user}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: email })
                })

                // console.log(response);
                const result = await response.json();
                //removing error message if any

                error.innerText = '';

                if (response.ok) {
                    if (result.status === "SUCCESS") {
                        setEmail('');
                        setIsVerified(true);
                        console.log("at login\n", result?.data);
                        setUserData(result?.data);

                    }
                    else { error.innerText = result.message }
                    // console.log('response recieved', response.status, result);
                } else {
                    // console.log("Error: ", response.status);
                    error.innerText = result.status;
                }

            } catch (e) {
                error.innerText = 'Check your Connection!';
            }
        } else {
            error.innerText = 'Enter email!';
        }
    }

    return ((isVerified) ? <Navigate to='/dashboard' /> :
        (<>
            <div className="container">
                <h2>Login</h2>
                <form >

                    <input type="email" placeholder="Email" name="user" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="submit" value="Login" onClick={handleSubmit} />
                </form>
                <div>
                    <div id='login_error'></div>
                    <h3>Have you Sign-Up!</h3>
                    <Link to="/user/signup">Signup</Link>
                </div>
            </div>
        </>)
    );
}

export default UserLogin;