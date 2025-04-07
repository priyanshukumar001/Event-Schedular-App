import { useState } from 'react';
import { admin } from "../../constants";
import { useUserData } from '../../../config/globalVariables';
import checkTimeCollision from '@/../utils/checkTimeCollision'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { X, Clock, CalendarPlus, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

interface UserDetailProps {
  selectedUser: any;
  onClose: () => void;
  users: any[];
}

interface Slot {
  _id: string;
  start: string;
  end: string;
  duration: number;
}

// This component acts as a popup to allot a schedule for the particular user
const UserDetail = ({ selectedUser, onClose, users }: UserDetailProps) => {
  const [userData, setUserData] = useUserData();
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [error, setError] = useState('');

  // This function checks for any collision in time schedule and informs before adding
  const handleSubmit = async () => {
    if (!attendeeName || !attendeeEmail || !startDateTime || !endDateTime) {
      setError('Please fill in all fields');
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start >= end) {
      setError('End time must be after start time');
      return;
    }

    if (checkTimeCollision(start, end, users)) {
      setError('The selected time slot collides with an existing slot.');
      return;
    }

    // Creating defined structure of new slot being assigned to user
    const newSlot = {
      start: start.toISOString(),
      end: end.toISOString(),
      attendees: [{ name: attendeeName, email: attendeeEmail }]
    };

    // Sending newSlot to server to save on database
    try {
      const response = await fetch(`${admin}/sessions/newAllotment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: selectedUser?.user, scheduledSlots: newSlot })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === "SUCCESS") {
          const updatedData = result?.data;
          setUserData(updatedData);

          // Reset form
          setAttendeeName('');
          setAttendeeEmail('');
          setStartDateTime('');
          setEndDateTime('');
          setError('');

          window.alert('New Slot Added Successfully!');
        } else {
          window.alert(result.message);
        }
      }
    } catch (err) {
      window.alert(err);
    }
  };

  // Group slots by date
  const groupedSlots = (selectedUser?.availableSlots || []).reduce((acc: any, slot: Slot) => {
    const date = new Date(slot.start).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedSlots).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <Card className="w-full max-w-4xl shadow-md">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>{selectedUser.name}'s Details</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Slots
          </h3>

          {sortedDates.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No available slots</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto rounded border p-1">
              {sortedDates.map((date) => (
                <div key={date} className="animate-fade-in">
                  <div className="bg-muted/50 px-3 py-1.5 sticky top-0">
                    <h4 className="font-medium text-sm">{date}</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedSlots[date].map((slot: Slot) => {
                        const startDate = new Date(slot.start);
                        const endDate = new Date(slot.end);
                        const durationMs = endDate.getTime() - startDate.getTime();
                        const durationMinutes = Math.floor(durationMs / (1000 * 60));

                        return (
                          <TableRow key={slot._id}>
                            <TableCell>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                            <TableCell>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                            <TableCell>{durationMinutes} min</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Add New Appointment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendeeName">Attendee Name</Label>
              <Input
                id="attendeeName"
                placeholder="Enter attendee name"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendeeEmail">Attendee Email</Label>
              <Input
                id="attendeeEmail"
                type="email"
                placeholder="Enter attendee email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-destructive mt-2 text-sm">{error}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserDetail;