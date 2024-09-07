import express from 'express';
import Admin from '../models/Admin.js'; //mongodb user model
import User from '../models/User.js';
import argon2 from 'argon2';

const AdminRouter = express.Router();

//admin signup using name, email, and password by the admin
AdminRouter.post('/signup', async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim(); //this is the name variable that we have already declared with previous object
    email = email.trim();
    password = password.trim();


    if (name == "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {

        //checking if user already exist
        try {
            const adminData = await Admin.findOne({ email });
            if (adminData) {
                //checks if a user already exits
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else {
                //password handling
                try {
                    const hash = await argon2.hash(password);
                    //try creating a new user
                    try {
                        const newUser = new Admin({
                            name,
                            email,
                            password: hash,
                        });
                        await newUser.save();
                        const userData = await User.find({});
                        console.log('new user created!');
                        res.json({
                            status: "SUCCESS",
                            message: "Successfully created new User!",
                            adminData: newUser,
                            userData: userData
                        });
                    } catch (error) {
                        res.json({
                            status: "FAILED",
                            message: "Error occured while saving new user!",
                            error_type: error
                        })
                    }
                } catch (error) {
                    res.json({
                        status: "FAILED",
                        message: "Error Hashing Password!",
                        error_type: error
                    })
                }

            }
        } catch (error) {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!",
                error_type: error
            });
        }

    }
});

//login
AdminRouter.post('/login', async (req, res) => {
    console.log(req.body);
    let { email, password } = req.body;

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials applied!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        })
    } else {
        email = email.trim();
        password = password.trim();
        try {
            const adminData = await Admin.findOne({ email });
            if (adminData) {
                try {
                    const storedPassword = adminData?.password;
                    const verification = await argon2.verify(storedPassword, password);
                    if (verification) {
                        const userData = await User.find({});
                        res.json({
                            status: "SUCCESS",
                            message: "Signin Successful!",
                            adminData: adminData,
                            userData: userData
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password!"
                        })
                    }
                } catch (error) {
                    res.json({
                        status: "FAILED",
                        message: "Error verifying password!"
                    })
                }
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid Credentials!"
                })
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: "Error verifying user!"
            });
        }
    }
});

export default AdminRouter;
