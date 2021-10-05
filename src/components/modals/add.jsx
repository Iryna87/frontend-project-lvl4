import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSocket } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const Add = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const addChannel = async (e) => {
    e.preventDefault();
    const { name } = Object.fromEntries(new FormData(e.target));
    try {
      setLoading(true);
      const result = await apiSocket.newChannel({ name });
      const { id } = result.data;
      dispatch(actions.changeCurrentChannelId({ id }));
      dispatch(actions.hideModal());
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form onSubmit={addChannel}>
          <Form.Group>
            <Form.Control type="text" name="name" data-testid="add-channel" className="mb-2" ref={inputRef} />
            <div className="d-flex justify-content-end">
              <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
              <Button type="submit" variant="primary" disabled={loading}>{t('Send')}</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
