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
    
    if (text.trim()) {
      socket.emit('join_room', { userId: userId, room: 'main-room' });
      socket.emit('send', { userId: userId, message: text.trim() });
      
      setText(''); // Clear the text input after sending the message
    }
  };

  useEffect(() => {
    const handleReceiveChat = (data: { username: string, message: string }) => {
      console.log(data.username, data.message, data)
      onSendMessage(data.username, data.message);
    };

    socket.on('send_chat', handleReceiveChat);

    return () => {
      socket.off('send_chat', handleReceiveChat);
    };
  }, [onSendMessage]);

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
