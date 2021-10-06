import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useSocket, useAuth } from '../hooks/index.jsx';
import { getCurrentChannelId } from '../selectors.js';

const MessageForm = () => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const auth = useAuth();
  const inputRef = useRef();
  const currentId = useSelector(getCurrentChannelId);

  useEffect(() => {
    inputRef.current.focus();
  }, [currentId]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const { body } = values;
      await apiSocket.newMessage({ body, channelId: currentId, name: auth.userData?.username });
      resetForm({ body: '' });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  });
  return (
    <>
      <Form className="py-1 border rounded-2" autoComplete="off" onSubmit={formik.handleSubmit}>
        <Form.Group className="input-group">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.body}
            placeholder={t('EnterMessage')}
            name="body"
            data-testid="new-message"
            className="border-0 p-0 ps-2"
            ref={inputRef}
          />
          <Button type="submit" className="input group append btn-group-vertical" variant="" disabled={formik.isSubmitting}>
            <ArrowRightSquare width="20" height="20" />
            <span className="visually-hidden">{t('Send')}</span>
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

export default MessageForm;
