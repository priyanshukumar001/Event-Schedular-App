import { useUserData } from "../../../config/globalVariables";
import { useState } from "react";
import { user } from "../../constants";

const TimeScheduler = ({ date }) => {
    const [duration, setDuration] = useState(30);
    const [customDuration, setCustomDuration] = useState({ hours: 0, minutes: 0 });
    const [startTime, setStartTime] = useState('00:00');
    const [userData, setUserData] = useUserData();

    //checks for any change in duration
    const handleDurationChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setDuration('custom');
        } else {
            setDuration(parseInt(value));
        }
    };

    //handles custom duration entered by user
    const handleCustomDurationChange = (e) => {
        const { name, value } = e.target;
        setCustomDuration((prev) => ({ ...prev, [name]: parseInt(value) }));
    };

    //this function calculate the end time form provide duration and start time
    const calculateEndTime = () => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        let totalMinutes = startHours * 60 + startMinutes + (duration === 'custom' ? customDuration.hours * 60 + customDuration.minutes : duration);
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    //this handles addition of new slots
    const handleAdd = async () => {
        const endTime = calculateEndTime();
        const startDate = new Date(date);
        const endDate = new Date(date);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        startDate.setHours(startHours, startMinutes);
        endDate.setHours(endHours, endMinutes);

        const data = {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            duration: duration === 'custom' ? customDuration.hours * 60 + customDuration.minutes : duration,
        };

        try {
            const response = await fetch(`${user}/sessions/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userData?.user, newSlots: data })
            });
            console.log(response);
            if (response.ok) {
                const result = await response.json();
                if (result.status == "SUCCESS") {
                    const updatedData = result?.data;
                    console.log(updatedData);
                    setUserData({ ...updatedData });
                    console.log("after: ", userData);
                } else {
                    window.alert(result.message);
                }
            }
        } catch (err) {
            window.alert(err);
        }

    };
    //rendering component for selecting user duration and time slots
    return (
        <div className="timeSchedular">
            <h2>Select Duration:</h2>
            <div className="duration-flex">
                <label>Duration:</label>
                <select className="duration-select" value={duration} onChange={handleDurationChange}>
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1 hour 30 min</option>
                    <option value={120}>2 hours</option>
                    <option value={150}>2 hours 30 min</option>
                    <option value={180}>3 hours</option>
                    <option value="custom">Please specify</option>
                </select>
                {duration === 'custom' && (
                    <div className="specify">
                        <input
                            type="number"
                            name="hours"
                            value={customDuration.hours}
                            onChange={handleCustomDurationChange}
                            placeholder="hours"
                        />
                        <input
                            type="number"
                            name="minutes"
                            value={customDuration.minutes}
                            onChange={handleCustomDurationChange}
                            placeholder="minutes"
                        />
                    </div>
                )}
            </div>
            <div className="duration-flex">
                <label>Start time:</label>
                <select className="duration-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                            {`${i % 12 === 0 ? 12 : i % 12}${i < 12 ? 'AM' : 'PM'}`}
                        </option>
                    ))}
                </select>
            </div>
            <div className="duration-flex">
                <label>End time:</label>
                <input className="duration-select" type="text" value={calculateEndTime()} readOnly />
            </div>
            <button className="click" onClick={handleAdd}>Add</button>
        </div>
    );
};

export default TimeScheduler;