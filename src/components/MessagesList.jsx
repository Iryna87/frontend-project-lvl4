import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentChannelMessages, getCurrentChannelId } from '../selectors.js';

const MessagesList = () => {
  const currentChannelMessages = useSelector(getCurrentChannelMessages);
  const currentId = useSelector(getCurrentChannelId);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChannelMessages]);

  return (
    <>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {currentChannelMessages?.map((message) => (
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

export default MessagesList;
