// function to check collision of schedules
const checkTimeCollision = (startDateTime, endDateTime, users) => {
    for (const user of users) {
        for (const slot of user.scheduledSlots) {
            const slotStart = new Date(slot.start);
            const slotEnd = new Date(slot.end);

            // Check if the given time range overlaps with the slot time range
            if (
                (startDateTime >= slotStart && startDateTime < slotEnd) || // Start time is within the slot
                (endDateTime > slotStart && endDateTime <= slotEnd) || // End time is within the slot
                (startDateTime <= slotStart && endDateTime >= slotEnd) // Slot is within the given time range
            ) {
                return true;
            }
        }
    }
    return false;
};

export default checkTimeCollision;

