import React from 'react';
import { useParams } from 'react-router-dom';
import AvailableSlots from './AvailableSlots';

const AvailableSlotsRoute: React.FC = () => {
    const { eventTypeId } = useParams<{ eventTypeId: string }>();
    if (!eventTypeId) return <div>Invalid event type</div>;
    return <AvailableSlots eventTypeId={eventTypeId} />;
};

export default AvailableSlotsRoute; 