import { useUserData } from "../../../config/globalVariables";
import { user } from "../../constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// This component renders and manage the available slots of the user
const AvailableSlots = () => {
    const [userData, setUserData] = useUserData();

    // Function to delete and manage available slots by user
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${user}/sessions/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userData?.user, slotId: id })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status == "SUCCESS") {
                    const updatedData = result?.data;
                    setUserData({ ...updatedData });
                } else {
                    window.alert(result.message);
                }
            }
        } catch (err) {
            window.alert(err);
        }

        const updatedSlots = userData.availableSlots.filter(slot => slot._id !== id);
        setUserData({ ...userData, availableSlots: updatedSlots });
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
        <Card className="shadow-lg">
            <CardHeader className="bg-blue-brand text-white rounded-t-lg">
                <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {sortedDates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No available slots. Add slots using the scheduler.
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

                            <div className="space-y-2">
                                {groupedSlots[date].map((slot) => {
                                    const startDate = new Date(slot.start);
                                    const endDate = new Date(slot.end);
                                    return (
                                        <div
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                            key={slot._id}
                                            id={slot._id}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 text-blue-brand rounded-full p-2">
                                                    <span className="text-xs font-medium">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <span className="text-gray-400">to</span>
                                                <div className="bg-blue-100 text-blue-brand rounded-full p-2">
                                                    <span className="text-xs font-medium">{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(slot._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                            {date !== sortedDates[sortedDates.length - 1] && <Separator className="mt-6" />}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default AvailableSlots;