import React, { useRef, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useSocket, useAuth } from '../hooks/index.jsx';
import { getCurrentChannelId } from '../selectors.js';

const MessageForm = () => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();

  const auth = useAuth();

  const currentId = useSelector(getCurrentChannelId);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, [currentId]);

  const addMessage = async (e) => {
    e.preventDefault();
    const obj = new FormData(e.target);
    const body = obj.get('body');
    if (body) {
      setLoading(true);
      await apiSocket.newMessage({ body, channelId: currentId, name: auth.userData?.username });
      setLoading(false);
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
              <Button type="submit" variant="" disabled={!!loading}>
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

export default MessageForm;
