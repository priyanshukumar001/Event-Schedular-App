import React, { useState } from 'react';
import UserDetail from './UserDetail';
import { useUserData } from '../../../config/globalVariables';

const UserList = () => {
    const [userData, setUserData] = useUserData();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className='userList'>
            {selectedUser ? (
                <UserDetail selectedUser={selectedUser} onClose={() => setSelectedUser(null)} users={userData} />
            ) : (
                <div>
                    <h2>User List</h2>
                    <ul className='userlist'>
                        {userData.map((user) => (
                            <li className='list' key={user._id} onClick={() => handleUserClick(user)}>
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserList;
