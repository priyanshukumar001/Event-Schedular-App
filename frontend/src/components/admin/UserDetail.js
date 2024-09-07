import React, { useState } from 'react';
import checkTimeCollision from '../../../utils/checkTimeCollision';
import { useUserData } from '../../../config/globalVariables';
import { admin } from '../../constants'

//this component act as an pop-up to allot a schedule for the particular user
const UserDetail = ({ selectedUser, onClose, users }) => {
    const [userData, setUserData] = useUserData();
    const [attendeeName, setAttendeeName] = useState('');
    const [attendeeEmail, setAttendeeEmail] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [error, setError] = useState('');

    //this function checks for any collision in time schedule and inform before adding
    const handleSubmit = async () => {
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (checkTimeCollision(start, end, users)) {
            setError('The selected time slot collides with an existing slot.');
            return;
        }

        //creating defined structure of new slot being assigned to user
        const newSlot = {
            start: start.toISOString(),
            end: end.toISOString(),
            attendees: [{ name: attendeeName, email: attendeeEmail }]
        };

        //sending newSlot to server to save on database
        try {
            const response = await fetch(`${admin}/sessions/newAllotment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: selectedUser?.user, scheduledSlots: newSlot })
            });
            // console.log(response);
            if (response.ok) {
                const result = await response.json();
                if (result.status == "SUCCESS") {
                    const updatedData = result?.data;
                    // console.log(updatedData);
                    setUserData(updatedData);
                    window.alert('New Slot Added Successfully!');
                    // console.log("after: ", userData);
                } else {
                    window.alert(result.message);
                }
            }
        } catch (err) {
            window.alert(err);
        }

        // Send newSlot to the server
        // console.log('New Slot:', newSlot);
        setError('');
    };

    // Group slots by date
    const groupedSlots = (selectedUser?.availableSlots || []).reduce((acc, slot) => {
        const date = new Date(slot.start).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedSlots).sort((a, b) => new Date(a) - new Date(b));

    return (
        <div className='Details' >
            <button className='click' onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, outline: "none", border: "none" }}>Close</button>
            <h2>{selectedUser.name}</h2>
            <h3>Available Slots</h3>
            {sortedDates.map((date) => (
                <div key={date}>
                    <h3>{date}</h3>
                    {groupedSlots[date].map((slot) => {
                        const startDate = new Date(slot.start);
                        const endDate = new Date(slot.end);
                        return (
                            <div key={slot._id} id={slot._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <span>{startDate.toLocaleTimeString()}</span>
                                <span style={{ marginLeft: '10px' }}>{endDate.toLocaleTimeString()}</span>
                                {/* <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(slot._id)}>Delete</button> */}
                            </div>
                        );
                    })}
                </div>
            ))}

            <h3>Add New Slot</h3>
            <div>
                <input
                    type="text"
                    placeholder="Attendee Name"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Attendee Email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Start Time"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="End Time"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                />
                <button className='click' onClick={handleSubmit} style={{ marginLeft: "1em" }}>Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default UserDetail;
