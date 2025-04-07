import { useUserData } from "../../../config/globalVariables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

// This component displays user the Scheduled slots assigned by admin
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
        <Card className="shadow-lg">
            <CardHeader className="bg-blue-brand text-white rounded-t-lg">
                <CardTitle>Scheduled Slots</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {sortedDates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No scheduled slots available.
                    </div>
                ) : (
                    sortedDates.map((date) => (
                        <div key={date} className="mb-6 last:mb-0">
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className="bg-blue-50 text-blue-brand">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {groupedSlots[date]
                                    .sort((a, b) => new Date(a.start) - new Date(b.start))
                                    .map((slot, index) => {
                                        const startDate = new Date(slot.start);
                                        const endDate = new Date(slot.end);
                                        return (
                                            <div
                                                className="p-4 bg-gray-50 rounded-md"
                                                key={index}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-blue-100 text-blue-brand rounded-full p-2">
                                                            <span className="text-xs font-medium">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <span className="text-gray-400">to</span>
                                                        <div className="bg-blue-100 text-blue-brand rounded-full p-2">
                                                            <span className="text-xs font-medium">{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {slot.attendees.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                        <Users className="h-4 w-4 text-blue-brand" />
                                                        <span className="font-medium">Attendees:</span>
                                                        <span>{slot.attendees.map(attendee => attendee.name).join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            {date !== sortedDates[sortedDates.length - 1] && <Separator className="mt-6" />}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default ScheduledSlots;