import { useUserData } from "../../../config/globalVariables";
import { admin } from "../../constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trash2, User } from "lucide-react";
import { Slot, User as USE } from "@/../config/types"

// For rendering upcoming sessions on admin dashboard 
const UpcomingSessions = () => {
  const [userData, setUserData] = useUserData();

  // Handles deletion of any predefined schedules also from database using specific id of that slot
  const handleDelete = async (slotId: string) => {
    try {
      const response = await fetch(`${admin}/sessions/deleteAllotment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ScheduledSlotId: slotId })
      });
      const result = await response.json();

      if (response.ok) {
        if (result.status === "SUCCESS") {
          setUserData(result?.userData);
        } else {
          console.error(result.message);
        }
      } else {
        console.error('Error: ' + response.status);
      }
    } catch (e) {
      console.error("UnAvailable!", e);
    }

    // Update the UserData context with the new scheduledSlots array
    const updatedUserData = userData.map((user: any) => ({
      ...user,
      scheduledSlots: user.scheduledSlots.filter((slot: any) => slot?._id !== slotId)
    }));
    setUserData(updatedUserData);
  };

  // Group slots by date for all users
  const groupedSlots = userData.reduce((acc: any, user: USE) => {
    user.scheduledSlots.forEach(slot => {
      const date = new Date(slot.start).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ ...slot, userName: user.name });
    });
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedSlots).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          <span>Upcoming Sessions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {sortedDates.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No upcoming sessions scheduled</p>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date} className="animate-fade-in">
                <div className="bg-muted/50 px-4 py-2 sticky top-0">
                  <h3 className="font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {date}
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Time</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedSlots[date].map((slot: any) => (
                      <TableRow key={slot._id}>
                        <TableCell className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-muted-foreground" />
                            {slot?.attendees.map((attendee: any) => attendee.name).join(', ')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-muted-foreground" />
                            {slot.userName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(slot._id)}
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;