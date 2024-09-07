import { useUserData } from "../../../config/globalVariables";

// this component displays user the Scheduled slots assigned by admint
const ScheduledSlots = () => {
    const [userData, setUserData] = useUserData();

    // Group slots by date
    const groupedSlots = (userData?.scheduledSlots || []).reduce((acc, slot) => {
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
        <div className="scheduledSlots">
            <h2>Scheduled Slots:</h2>
            {sortedDates.map((date) => (
                <div key={date}>
                    <h3>{date}</h3>
                    {groupedSlots[date].sort((a, b) => new Date(a.start) - new Date(b.start)).map((slot, index) => {
                        const startDate = new Date(slot.start);
                        const endDate = new Date(slot.end);
                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <span>{startDate.toLocaleTimeString()}</span>
                                <span style={{ marginLeft: '10px' }}>{endDate.toLocaleTimeString()}</span>
                                <span style={{ marginLeft: '10px' }}>Attendees: {slot.attendees.map(attendee => attendee.name).join(', ')}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default ScheduledSlots;