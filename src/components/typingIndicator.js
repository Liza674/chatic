// src/components/TypingIndicator.js
import React from 'react';

const TypingIndicator = ({ isTyping }) => {
    return <div>{isTyping && <p>Someone is typing...</p>}</div>;
};

export default TypingIndicator;
