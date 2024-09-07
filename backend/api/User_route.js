import express from 'express';
import User from '../models/User.js'; //mongodb user model

const UserRouter = express.Router();

//user signup
UserRouter.post('/signup', async (req, res) => {
    let { name, user } = req.body;
    name = name.trim(); //this is the name variable that we have already declared with previous object
    user = user.trim();

    if (name == "" || user == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        })
    } else {

        //checking if user already exist
        try {

            const result = await User.findOne({ user });
            if (result) {
                //checks if a user already exits
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else {
                //password handling
                try {
                    // const hash = await argon2.hash(email);

                    //try creating a new user
                    try {
                        const newUser = new User({
                            user: user,
                            name,
                        });
                        await newUser.save();

                        console.log('new user created!');
                        res.json({
                            status: "SUCCESS",
                            message: "Successfully created new User!",
                            data: newUser
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

//user login
UserRouter.post('/login', async (req, res) => {
    // console.log(req.body);
    let { user } = req.body;
    user = user.trim();

    if (user == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials applied!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        })
    } else {

        try {
            const userData = await User.findOne({ user });
            if (userData) {
                res.json({
                    status: "SUCCESS",
                    message: "Signin Successful!",
                    data: userData
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid Credentials!"
                })
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: "Error verifying user!",
                error_type: error
            });
        }
    }
});

export default UserRouter;
