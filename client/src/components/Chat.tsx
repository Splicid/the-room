import React, { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);

  const handleSendMessage = (user: string, text: string) => {
    setMessages((messages) => [...messages, { user, text }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <Message key={index} user={message.user} text={message.text} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
