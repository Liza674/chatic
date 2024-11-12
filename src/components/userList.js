// src/components/OnlineUsers.js
import React, { useEffect, useState } from 'react';

const OnlineUsers = ({ socket }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        socket.on('updateOnlineUsers', (users) => {
            setOnlineUsers(users);
        });

        return () => socket.off('updateOnlineUsers');
    }, [socket]);

    return (
        <div>
            <h4>Online Users</h4>
            <ul>
                {onlineUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
};

export default OnlineUsers;
