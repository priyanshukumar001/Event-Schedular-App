import React, { useEffect, useState } from "react";
import { useSelectedDate } from "../../../config/globalVariables";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Calendar = () => {
    const [selDate, setSelDate] = useSelectedDate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
    const [startDay, setStartDay] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days: Date[] = [];

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        setDaysInMonth(days);
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Adjust for Sunday as the first day
        setStartDay(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelDate(date);
    }

    const today = new Date();

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-blue-brand text-white rounded-t-lg pb-2">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-blue-800 hover:text-white"
                        onClick={prevMonth}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <CardTitle className="text-xl font-medium">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-blue-800 hover:text-white"
                        onClick={nextMonth}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-7 gap-1 text-center">
                    {dayNames.map((day) => (
                        <div key={day} className="text-xs font-medium text-gray-500 py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-1">
                    {Array.from({ length: startDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square"></div>
                    ))}
                    {daysInMonth.map((day) => {
                        const isToday = day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear();

                        const isSelected = selectedDate &&
                            day.getDate() === selectedDate.getDate() &&
                            day.getMonth() === selectedDate.getMonth() &&
                            day.getFullYear() === selectedDate.getFullYear();

                        return (
                            <Button
                                key={day.toISOString()}
                                variant="ghost"
                                className={cn(
                                    "aspect-square p-0 h-auto rounded-full",
                                    isToday && !isSelected && "bg-blue-200 text-blue-brand font-medium hover:bg-blue-200",
                                    isSelected && "bg-blue-brand text-white hover:bg-blue-700"
                                )}
                                onClick={() => handleDateClick(day)}
                            >
                                <span className="text-sm">{day.getDate()}</span>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default Calendar;