import React from 'react';
import { useUserData } from '../../../config/globalVariables';
import { admin } from '../../constants';

// for rendering upcoming sessions on admin dashboard 
const UpcomingSessions = () => {
    const [userData, setUserData] = useUserData();

    //handles deletion of any predefined schedules also from database using specific id of that slot
    const handleDelete = async (slotId) => {
        try {
            const response = await fetch(`${admin}/sessions/deleteAllotment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ScheduledSlotId: slotId })
            });
            const result = await response.json();

            if (response.ok) {
                if (result.status === "SUCCESS") {
                    setUserData(result?.userData);
                } else {
                    console.error(result.message);
                }
            } else {
                console.error('Error: ' + response.status);
            }
        } catch (e) {
            console.error("UnAvailable!", e);
        }

        // Update the UserData context with the new scheduledSlots array
        const updatedUserData = userData.map(user => ({
            ...user,
            scheduledSlots: user.scheduledSlots.filter(slot => slot._id !== slotId)
        }));
        setUserData(updatedUserData);
    };

    // Group slots by date for all users
    const groupedSlots = userData.reduce((acc, user) => {
        user.scheduledSlots.forEach(slot => {
            const date = new Date(slot.start).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({ ...slot, userName: user.name });
        });
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedSlots).sort((a, b) => new Date(a) - new Date(b));

    return (
        <div className='upcomingSessions'>
            <h2>Upcoming Sessions:</h2>
            {sortedDates.map((date) => (
                <div className='upcomingSchedules' key={date}>
                    <h3>{date}</h3>
                    {groupedSlots[date].map((slot) => (
                        <div className='meetings' key={slot._id} id={slot._id} >
                            <div style={{ marginRight: '0.6em' }}>
                                {new Date(slot.start).toLocaleTimeString()} - {new Date(slot.end).toLocaleTimeString()}
                            </div>
                            <div style={{ marginRight: '0.6em' }}>
                                Attendees:  {slot.attendees.map((attendee) => attendee.name).join(', ')}
                            </div>
                            <div style={{ marginRight: '0.6em' }}>
                                User: {slot.userName}
                            </div>
                            <button className='click' onClick={() => handleDelete(slot._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};



export default UpcomingSessions;
