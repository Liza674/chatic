// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

const socket = io('http://localhost:3000'); 

const Chat = ({ username }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        socket.emit('join', username);
        socket.on('message', (msg) => {
            setChatHistory((prev) => [...prev, msg]);
        });

        return () => socket.off('message');
    }, [username]);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', { username, text: message });
            setMessage('');
        }
    };

    return (
        <div>
            <div className="chat-history">
                {chatHistory.map((msg, index) => (
                    <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
