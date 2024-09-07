import express from "express";
import User from "../models/User.js";

const AvailableRoute = express.Router();

//for updating new slots of availability as provided by user
AvailableRoute.post('/sessions/new', async (req, res) => {
    let { user, newSlots } = req.body;

    user = user.trim();

    //newSlots would not be empty
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

            const response = await User.updateOne(
                { user: user },
                { $push: { availableSlots: newSlots } }
            );
            if (response?.acknowledged) {
                const userData = await User.findOne({ user });
                res.json({
                    status: "SUCCESS",
                    message: "New Slot Added",
                    response: response,
                    data: userData
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "User not found!"
                })
            }
            // console.log('Update result:', userData);

        } catch (error) {
            res.json({
                status: "FAILED",
                message: "Error adding new slots",
                error_type: error
            })
            console.error('Error appending availableSlots:', error);
        }
    }


});

//for handling deleted availble slots by the user, 
// using the specific id of that slot to identify the user and deleting that slot

AvailableRoute.post('/sessions/delete', async (req, res) => {
    let { user, slotId } = req.body;
    user = user.trim();

    if (user === "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials applied!"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered!"
        });
    } else {
        try {
            const response = await User.updateOne(
                { user: user },
                { $pull: { availableSlots: { _id: slotId } } }
            );

            if (response.matchedCount === 0) {
                res.json({
                    status: "FAILED",
                    message: "User not found!"
                });
            } else if (response.modifiedCount === 0) {
                res.json({
                    status: "FAILED",
                    message: "Slot not found in availableSlots"
                });
            } else {
                const userData = await User.findOne({ user: user });
                res.json({
                    status: "SUCCESS",
                    message: "Slot deleted successfully",
                    response: response,
                    data: userData
                });
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: "Error deleting slot",
                error_type: error
            });
            console.error('Error deleting slot:', error);
        }
    }
});


export default AvailableRoute;