import React from 'react';
import MessageFormChat from './MessageFormChat.jsx';
import MessagesListChat from './MessagesListChat.jsx';

const Chat = ({
  currentChannel, currentChannelMessages, messages, currentId, channels,
}) => (
  <>
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {currentChannel?.length !== 0 ? currentChannel[0].name : ''}
            </b>
          </p>
          <span className="text-muted">
            {currentChannelMessages?.length !== 0 ? currentChannelMessages.length : '0'}
            {' '}
            сообщений
          </span>
        </div>
        <MessagesListChat
          messages={messages}
          currentId={currentId}
        />
        <div className="mt-auto px-5 py-3">
          <MessageFormChat
            channels={channels}
            currentId={currentId}
          />
        </div>
      </div>
    </div>
  </>
);

export default Chat;
