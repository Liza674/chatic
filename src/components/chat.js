import React, { useEffect, useState } from 'react';
import './chat.css'; //chat.css for style

const Chat = ({ username, otherUsername, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [image, setImage] = useState(null);
    const [isChatEnded, setIsChatEnded] = useState(false); // Track whether chat is ended or ongoing
    const [viewingHistory, setViewingHistory] = useState(false); // Track if user is viewing history

    // Create a unique key for this conversation using both usernames
    const conversationKey = `${username}-${otherUsername}`;

    useEffect(() => {
        // Load chat history from localStorage if the chat is resumed
        if (!isChatEnded && !viewingHistory) {
            const savedMessages = JSON.parse(localStorage.getItem(conversationKey)) || [];
            setMessages(savedMessages); // Only load history when chat is resumed
        }

        // Initialize WebSocket
        const ws = new WebSocket('ws:http://localhost:3000');
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'message') {
                setMessages((prevMessages) => [...prevMessages, data]);
            } else if (data.type === 'typing') {
                setIsTyping(data.username !== username && data.isTyping);
            }
        };

        return () => ws.close();
    }, [username, otherUsername, isChatEnded, viewingHistory]);

    useEffect(() => {
        // Save chat history to localStorage when messages change and chat is ongoing
        if (!isChatEnded && !viewingHistory) {
            localStorage.setItem(conversationKey, JSON.stringify(messages));
        }
    }, [messages, conversationKey, isChatEnded, viewingHistory]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                type: 'message',
                username,
                text: newMessage,
                timestamp: new Date().toLocaleString()
            };
            socket.send(JSON.stringify(message));
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    const deleteMessage = (index) => {
        const updatedMessages = [...messages];
        updatedMessages[index] = { ...updatedMessages[index], text: 'Message Deleted', isDeleted: true }; // Mark as deleted
        setMessages(updatedMessages);
        localStorage.setItem(conversationKey, JSON.stringify(updatedMessages)); // Save updated history
    };

    const handleDeleteChat = () => {
        const deletedMessages = messages.map((msg) => ({
            ...msg,
            text: 'Message Deleted',
            isDeleted: true
        }));
        setMessages(deletedMessages);
        localStorage.setItem(conversationKey, JSON.stringify(deletedMessages));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            setImage(URL.createObjectURL(file));
        }
    };

    const sendImage = () => {
        if (image && socket) {
            const imageMessage = { type: 'image', username, image, timestamp: new Date().toLocaleString() };
            socket.send(JSON.stringify(imageMessage));
            setMessages([...messages, imageMessage]);
            setImage(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('username');
        onLogout();
    };

    // Handle end chat
    const endChat = () => {
        setIsChatEnded(true); // Mark the chat as ended
        localStorage.setItem(conversationKey, JSON.stringify(messages)); // Save the final chat history
    };

    // Handle resume chat
    const resumeChat = () => {
        setIsChatEnded(false); // Mark the chat as ongoing
        setViewingHistory(false); // Make sure user is not viewing history
        const savedMessages = JSON.parse(localStorage.getItem(conversationKey)) || [];
        setMessages(savedMessages); // Load the previous chat history when resumed
    };

    // Handle view history
    const viewHistory = () => {
        setViewingHistory(true); // Mark that the user is viewing the history
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="welcome-message">Welcome, {username}</div>
                <button onClick={logout} className="logout-button">Logout</button>
            </header>

            {isTyping && <div className="typing-indicator">{otherUsername} is typing...</div>}

            {!isChatEnded && !viewingHistory && (
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.username}</strong>: {msg.isDeleted ? 'Message Deleted' : msg.text}
                            {msg.image && <img src={msg.image} alt="shared" className="chat-image" />}
                            <div className="timestamp">{msg.timestamp}</div>
                            {!msg.isDeleted && (
                                <button onClick={() => deleteMessage(index)} className="delete-message-button">Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {viewingHistory && (
                <div className="chat-history">
                    <h3>Chat History</h3>
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.username}</strong>: {msg.isDeleted ? 'Message Deleted' : msg.text}
                            {msg.image && <img src={msg.image} alt="shared" className="chat-image" />}
                            <div className="timestamp">{msg.timestamp}</div>
                        </div>
                    ))}
                    <button onClick={resumeChat} className="resume-chat-button">Resume Chat</button>
                </div>
            )}

            {!viewingHistory && !isChatEnded && (
                <div className="image-upload">
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {image && <img src={image} alt="preview" className="image-preview" />}
                    <button onClick={sendImage} className="send-button">Send Image</button>
                </div>
            )}

            {!viewingHistory && !isChatEnded && (
                <div className="chat-input-container">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="chat-input"
                    />
                    <button onClick={sendMessage} className="send-button">Send</button>
                </div>
            )}

            {!viewingHistory && !isChatEnded && (
                <button onClick={endChat} className="end-chat-button">End Chat</button>
            )}

            {isChatEnded && !viewingHistory && (
                <div className="history-buttons">
                    <button onClick={viewHistory} className="history-button">View History</button>
                    <button onClick={resumeChat} className="resume-chat-button">Resume Chat</button>
                </div>
            )}

            <button onClick={handleDeleteChat} className="delete-chat-button">Delete All Chat</button>
        </div>
    );
};

export default Chat;

