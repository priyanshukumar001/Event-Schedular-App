import express from "express";
import User from "../models/User.js";

const AllotmentRoute = express.Router();

//it allots new Scheduled Slots against the provided available slot by the user 
AllotmentRoute.post('/sessions/newAllotment', async (req, res) => {
    let { user, scheduledSlots } = req.body;

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
                { $push: { scheduledSlots: scheduledSlots } }
            );
            console.log('Update response:', response); // Log the response

            if (response?.acknowledged) {
                const userData = await User.find({});
                res.json({
                    status: "SUCCESS",
                    message: "New Slot Added",
                    response: response,
                    data: userData
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "User not found!"
                });
            }
        } catch (error) {
            res.json({
                status: "FAILED",
                message: "Error adding new slots",
                error_type: error
            });
            console.error('Error during update:', error); // Log the error
        }

    }


});


//handles deletion of a particular Scheduled slot, of which the id is send by client
AllotmentRoute.post('/sessions/deleteAllotment', async (req, res) => {
    let { ScheduledSlotId } = req.body;

    try {

        const response = await User.updateOne(
            { 'scheduledSlots._id': ScheduledSlotId },
            { $pull: { scheduledSlots: { _id: ScheduledSlotId } } }
        );

        if (response.matchedCount === 0) {
            res.json({
                status: "FAILED",
                message: "User not found!"
            });
        } else if (response.modifiedCount === 0) {
            res.json({
                status: "FAILED",
                message: "Slot not found in Scheduled Slots"
            });
        } else {
            const userData = await User.findOne({ 'scheduledSlots._id': ScheduledSlotId });
            // const userData = await User.findOne({ user: user });
            res.json({
                status: "SUCCESS",
                message: "Scheduled Slot deleted successfully",
                response: response,
                userdata: userData
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
    // }
});

export default AllotmentRoute;