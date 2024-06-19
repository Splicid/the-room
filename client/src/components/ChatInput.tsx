import React, { useState, useEffect } from 'react';
import { Socket, io } from "socket.io-client";

interface ChatInputProps {
  onSendMessage: (user: string, text: string) => void;
}
const socket = io('http://localhost:5000');

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const str = document.cookie;
    const parts = str.split('=');
    const userId = parts[1];
    
    // Only emit the send event when there's text to send
    if (text.trim()) {
      socket.emit('send', userId);
    }
  };

  useEffect(() => {
    const handleReceiveChat = (username: string) => {
      
      if (text.trim()) {
        onSendMessage(username, text);
        setText(''); // Clear the text input after sending the message
      }
    };

    socket.on('send_chat', handleReceiveChat);

    // Cleanup the effect to avoid adding multiple listeners
    return () => {
      socket.off('send_chat', handleReceiveChat);
    };
  }, [text, onSendMessage]); // Adding text and onSendMessage as dependencies

  return (
    <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => (e.key === 'Enter' ? handleSend() : null)}
        style={{ flexGrow: 1, marginRight: '10px' }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
