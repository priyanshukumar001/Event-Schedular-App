import { useState } from 'react';
import { useUserData } from '../../../config/globalVariables';
import UserDetail from './UserDetail';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Users, User as UserIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// This contains all users list that are registered 
const UserList = () => {
    const [userData] = useUserData();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const filteredUsers = userData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Rendering users name which on click displays their available time slots where new slots can be assigned
    return (
        <div className="w-full h-full">
            {selectedUser ? (
                <UserDetail
                    selectedUser={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    users={userData}
                />
            ) : (
                <Card className="shadow-md h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Users size={20} />
                            <span>User Management</span>
                        </CardTitle>

                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredUsers.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">No users found</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {filteredUsers.map((user) => (
                                    <Card
                                        key={user._id}
                                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.availableSlots.length} available slots
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserList;