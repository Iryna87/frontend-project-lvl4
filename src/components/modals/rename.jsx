import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSocket } from '../../hooks/index.jsx';
import { getChannels, getCurrentChannelId } from '../../selectors.js';

const Rename = ({
  hideModal, modals,
}) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();

  const channels = useSelector(getChannels);
  const currentId = useSelector(getCurrentChannelId);

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const renameChannel = async (e) => {
    e.preventDefault();
    dispatch(hideModal());
    const { name } = Object.fromEntries(new FormData(e.target));
    const names = channels?.map((channel) => channel.name);
    const differenses = names.filter((item) => item === name);
    if (differenses.length > 0) {
      throw new Error(t('ThisNameAlreadyExists'));
    } else {
      await apiSocket.renameChannel({ id: currentId, name });
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
            <button type="button" className="me-2 btn btn-secondary" onClick={hideModal}>{t('Cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={!modals}>{t('Rename')}</button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
