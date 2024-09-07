import { useUserData } from "../../../config/globalVariables";
import { user } from "../../constants";

//this component renders and manage the available slots of the user

const AvailableSlots = () => {
    const [userData, setUserData] = useUserData();

    // function to delete and manage available slots by user
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${user}/sessions/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userData?.user, slotId: id })
            });
            // console.log(response);
            if (response.ok) {
                const result = await response.json();
                if (result.status == "SUCCESS") {
                    const updatedData = result?.data;
                    // console.log(updatedData);
                    setUserData({ ...updatedData });
                    // console.log("after: ", userData);
                } else {
                    window.alert(result.message);
                }
            }
        } catch (err) {
            window.alert(err);
        }

        const updatedSlots = userData.availableSlots.filter(slot => slot._id !== id);
        setUserData({ ...userData, availableSlots: updatedSlots });
        // console.log(userData);
    };

    // Group slots by date
    const groupedSlots = (userData?.availableSlots || []).reduce((acc, slot) => {
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
        <div className="availableSlots">
            <h2>Available Slots:</h2>
            {sortedDates.map((date) => (
                <div key={date}>
                    <h3>{date}</h3>
                    {groupedSlots[date].map((slot) => {
                        const startDate = new Date(slot.start);
                        const endDate = new Date(slot.end);
                        return (
                            <div className="duration-flex" key={slot._id} id={slot._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <span>{startDate.toLocaleTimeString()}</span>
                                <span style={{ marginLeft: '10px' }}>{endDate.toLocaleTimeString()}</span>
                                <button className="click" style={{ marginLeft: '10px' }} onClick={() => handleDelete(slot._id)}>Delete</button>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};


export default AvailableSlots;