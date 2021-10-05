import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MessageForm from './MessageForm.jsx';
import MessagesList from './MessagesList.jsx';
import { getCurrentChannel, getCurrentChannelMessages } from '../selectors.js';

const Chat = () => {
  const { t } = useTranslation();
  const currentChannel = useSelector(getCurrentChannel);
  const currentChannelMessages = useSelector(getCurrentChannelMessages);

  return (
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
              {t('nMessages', { count: currentChannelMessages.length })}
            </span>
          </div>
          <MessagesList />
          <div className="mt-auto px-5 py-3">
            <MessageForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
