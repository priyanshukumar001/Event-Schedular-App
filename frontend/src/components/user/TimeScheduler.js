import { useUserData } from "../../../config/globalVariables";
import { useState } from "react";
import { user } from "../../constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock } from "lucide-react";

const TimeScheduler = ({ date }) => {
    const [duration, setDuration] = useState("30");
    const [customDuration, setCustomDuration] = useState({ hours: 0, minutes: 0 });
    const [startTime, setStartTime] = useState('00:00');
    const [userData, setUserData] = useUserData();

    // Checks for any change in duration
    const handleDurationChange = (value) => {
        if (value === 'custom') {
            setDuration('custom');
        } else {
            setDuration(value);
        }
    };

    // Handles custom duration entered by user
    const handleCustomDurationChange = (e) => {
        const { name, value } = e.target;
        setCustomDuration((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    // This function calculates the end time from provided duration and start time
    const calculateEndTime = () => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        let totalMinutes = startHours * 60 + startMinutes + (duration === 'custom' ? customDuration.hours * 60 + customDuration.minutes : parseInt(duration));
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    // This handles addition of new slots
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
            duration: duration === 'custom' ? customDuration.hours * 60 + customDuration.minutes : parseInt(duration),
        };

        try {
            const response = await fetch(`${user}/sessions/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userData?.user, newSlots: data })
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
    };

    // Rendering component for selecting user duration and time slots
    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-blue-brand text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Scheduler
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {!date ? (
                    <div className="text-center py-8 text-gray-500">
                        Please select a date from the calendar
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-1">Selected Date:</h3>
                            <p className="text-blue-brand font-semibold">
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Select value={duration} onValueChange={handleDurationChange}>
                                    <SelectTrigger id="duration" className="w-full bg-blue-100">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-blue-100">
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="90">1 hour 30 minutes</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                        <SelectItem value="150">2 hours 30 minutes</SelectItem>
                                        <SelectItem value="180">3 hours</SelectItem>
                                        <SelectItem value="custom">Custom duration</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {duration === 'custom' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hours">Hours</Label>
                                        <Input
                                            id="hours"
                                            type="number"
                                            name="hours"
                                            value={customDuration.hours}
                                            onChange={handleCustomDurationChange}
                                            min="0"
                                            max="23"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minutes">Minutes</Label>
                                        <Input
                                            id="minutes"
                                            type="number"
                                            name="minutes"
                                            value={customDuration.minutes}
                                            onChange={handleCustomDurationChange}
                                            min="0"
                                            max="59"
                                            step="5"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Select value={startTime} onValueChange={setStartTime}>
                                    <SelectTrigger id="startTime" className="w-full bg-blue-100">
                                        <SelectValue placeholder="Select start time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-blue-100">
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={`${String(i).padStart(2, '0')}:00`}>
                                                {`${i % 12 === 0 ? 12 : i % 12}:00 ${i < 12 ? 'AM' : 'PM'}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    value={calculateEndTime()}
                                    readOnly
                                    className="bg-gray-50"
                                />
                            </div>

                            <Button
                                onClick={handleAdd}
                                className="w-full bg-blue-brand hover:bg-blue-700"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Slot
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default TimeScheduler;