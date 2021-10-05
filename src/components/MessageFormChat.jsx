import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useSocket } from '../hooks/index.jsx';

const MessageFormChat = ({ currentId, channels }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();

  const activeChannel = channels?.find(({ id }) => id === currentId);

  const addMessage = async (e) => {
    e.preventDefault();
    const obj = new FormData(e.target);
    const body = obj.get('body');
    if (body) {
      await apiSocket.newMessage({ body, channelId: currentId, name: activeChannel.name });
    } else {
      throw new Error();
    }
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <Form noValidate="" className="py-1 border rounded-2" autoComplete="off" onSubmit={addMessage}>
        <Form.Group>
          <div className="input-group has-validation">
            <input name="body" data-testid="new-message" className="border-0 p-0 ps-2 form-control" placeholder={t('EnterMessage')} ref={inputRef} />
            <div className="input-group-append">
              <Button type="submit" className="btn btn-group-vertical" disabled={false}>
                <ArrowRightSquare width="20" height="20" />
                <span className="visually-hidden">{t('Send')}</span>
              </Button>
            </div>
          </div>
        </Form.Group>
        <Form.Control.Feedback type="invalid" />
      </Form>
    </>
  );
};

export default MessageFormChat;
