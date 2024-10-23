import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useVerify } from '../../config/globalVariables.js';
import { user } from '../constants.js';
import { useUserData } from '../../config/globalVariables.js';


const UserSignup = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [userData, setUserData] = useUserData();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = document.getElementById('sign_error');
        const success = document.getElementById('sign_success');
        if (userName !== '') {
            if (email != '') {
                try {
                    const response = await fetch(`${user}/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: userName, user: email })
                    });
                    const result = await response.json();

                    if (response.ok) {
                        error.innerText = '';
                        if (result.status === "SUCCESS") {
                            success.innerText = 'Successfully Created New User!';
                            setUserData(result?.data)
                            setIsVerified(true);
                            setIsAdmin(false);
                            setUserName('');
                            setEmail('');
                        } else {
                            // console.log(result.message);
                            error.innerText = result.message;
                        }

                    } else {
                        // console.log('Error: ' + response.status);
                        error.innerText = response.status;
                    }
                } catch (e) {
                    // error.innerText = "Check your connection!";
                    error.innerText = e;
                }
            } else {
                error.innerHTML = 'Enter Email';
            }

        } else {
            error.innerText = 'Enter Username!';
        }



    }
    //if user already verified navigate to the user dashboard
    return ((isVerified) ? <Navigate to='/user' /> :
        (<>
            <div className="container">
                <h2>Sign Up</h2>
                <form >
                    <input type="text" placeholder="Name" name="name" required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input type="email" placeholder="Email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="submit" value="Sign Up" onClick={handleSubmit} />
                </form>
                <div>
                    <div id='sign_error'></div>
                    <div id='sign_success' style={{ color: "green" }}></div>
                    <h3>Already a User !</h3>
                    <Link to="/user/login">Login</Link>
                </div>
            </div>
        </>)
    );
}

export default UserSignup;