import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAdminData, useUserData, useVerify } from '../../config/globalVariables.js';
import { admin } from '../constants.js';


const AdminSignup = () => {
    const { isVerified, setIsVerified, isAdmin, setIsAdmin } = useVerify();

    //global context values for accessing user and admin informations
    const [userData, setUserData] = useUserData();
    const [adminData, setAdminData] = useAdminData();

    //state variables for changing values
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPaasWord] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    //function to handle signup informations
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = document.getElementById('sign_error');
        const success = document.getElementById('sign_success');
        if (userName !== '') {
            if (passWord !== '') {
                if (passwordCheck !== '') {
                    if (passWord === passwordCheck) {
                        try {
                            const response = await fetch(`${admin}/signup`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ name: userName, email: email, password: passWord })
                            });
                            const result = await response.json();

                            if (response.ok) {
                                error.innerText = '';
                                if (result.status === "SUCCESS") {
                                    setPaasWord('');
                                    setUserName('');
                                    setPasswordCheck('');
                                    success.innerText = 'Successfully Created New User!';
                                    setAdminData(result?.adminData);
                                    setUserData(result?.userData);
                                    setIsVerified(true);
                                    setIsAdmin(true);
                                } else {
                                    error.innerText = result.message;
                                }

                            } else {
                                // console.log('Error: ' + response.status);
                                error.innerText = response.status;
                            }
                        } catch (e) {
                            error.innerText = "Check your connection!";
                        }
                    } else {
                        error.innerText = 'Password does not match!';
                    }
                } else {
                    error.innerText = 'Re-enter password!';
                }
            } else {
                error.innerText = 'Enter Password!';
            }
        } else {
            error.innerText = 'Enter Username!';
        }



    }
    //if user is verified navigate to dashboard
    return ((isVerified) ? <Navigate to='/admin' /> :
        (<>
            <div className="container">
                <h2>Sign Up</h2>
                <form >
                    <input type="text" placeholder="Name" name="name" required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input type="email" placeholder="Email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" placeholder="Password" name="password" required value={passWord} onChange={(e) => setPaasWord(e.target.value)} />
                    <input type="password" placeholder="Re-enter password" name="passcheck" required value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} />
                    <input type="submit" value="Sign Up" onClick={handleSubmit} />
                </form>
                <div>
                    <div id='sign_error'></div>
                    <div id='sign_success' style={{ color: "green" }}></div>
                    <h3>Already a User !</h3>
                    <Link to="/admin/login">Login</Link>
                </div>
            </div>
        </>)
    );
}

export default AdminSignup;