import React, { useEffect, useRef } from 'react';

const MessagesListChat = ({ currentId, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages?.map((message) => (
          message.channelId === currentId ? (
            <div key={message.id} className="text-break mb-2">
              <b>{message.name}</b>
              :
              {' '}
              {message.body}
            </div>
          ) : ''
        ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default MessagesListChat;
