import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useVerify, useUserData } from '../../config/globalVariables.js';
import { admin } from '../constants.js';
import { useAdminData } from '../../config/globalVariables.js';

const AdminLogin = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();
    const [adminData, setAdminData] = useAdminData();
    const [userData, setUserData] = useUserData();
    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');

    // function to handle login informations of admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = document.getElementById('login_error')
        if (email !== '') {
            if (passWord !== '') {
                try {

                    const response = await fetch(`${admin}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: email, password: passWord })
                    })

                    // console.log(response);
                    const result = await response.json();
                    //removing error message if any

                    error.innerText = '';

                    if (response.ok) {
                        //clearing input fields

                        setPassWord('');
                        if (result.status === "SUCCESS") {
                            setEmail('');
                            setIsVerified(true); //ensuring the user is verified now unless reloads the page
                            setUserData(result?.userData); // udpating list of users informations
                            setAdminData(result?.adminData); //updating admin informations
                            setIsAdmin(true); //checking if loggined by user
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
                error.innerText = 'Enter password!'
            }
        } else {
            error.innerText = 'Enter username!';
        }



    }

    //ensuring that if user is verified navigate to the admin dashboard
    return ((isVerified) ? <Navigate to='/admin' /> :
        (<>
            <div className="container">
                <h2>Login</h2>
                <form >
                    <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" name="password" value={passWord} onChange={(e) => setPassWord(e.target.value)} required />
                    <input type="submit" value="Login" onClick={handleSubmit} />
                </form>
                <div>
                    <div id='login_error'></div>
                    <h3>Have you Sign-Up!</h3>
                    <Link to="/admin/signup">Signup</Link>
                </div>
            </div>
        </>)
    );
}

export default AdminLogin;