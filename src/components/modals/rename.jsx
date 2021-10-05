import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSocket } from '../../hooks/index.jsx';
import { getModalExtraData, getChannelById } from '../../selectors.js';

const Rename = ({ hideModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const channelId = useSelector(getModalExtraData);
  const channel = useSelector(getChannelById(channelId));

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const renameChannel = async (e) => {
    e.preventDefault();
    const { name } = Object.fromEntries(new FormData(e.target));
    if (name === channel.name) {
      throw new Error(t('ThisNameAlreadyExists'));
    }
    try {
      setLoading(true);
      console.log(channelId, channel, name);
      await apiSocket.renameChannel({ id: channelId, name });
      dispatch(hideModal());
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form onSubmit={renameChannel}>
          <div className="form-group">
            <input name="name" data-testid="rename-channel" className="mb-2 form-control" ref={inputRef} />
            <div className="invalid-feedback" />
          </div>
          <div className="d-flex justify-content-end">
            <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
            <Button type="submit" variant="primary" disabled={loading}>{t('Rename')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
