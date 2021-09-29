import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSocket } from '../../hooks/index.jsx';

const Rename = ({
  hideModal, modals,
}) => {
  const t = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);
  const currentId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const names = channels?.map((channel) => channel.name);

  const renameNewChannel = async (e) => {
    e.preventDefault();
    dispatch(hideModal());
    const { name } = Object.fromEntries(new FormData(e.target));
    const differenses = names.filter((item) => item === name);
    if (differenses.length > 0) {
      throw new Error('This name alleready exists');
    } else {
      await apiSocket.renameChannel({ id: currentId, name });
    }
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <div className="modal-title h4">{t.t('RenameChannel')}</div>
        <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" onClick={hideModal} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={renameNewChannel}>
          <div className="form-group">
            <input name="name" data-testid="rename-channel" className="mb-2 form-control" ref={inputRef} />
            <div className="invalid-feedback" />
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="me-2 btn btn-secondary" onClick={hideModal}>{t.t('Cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={!modals}>{t.t('Rename')}</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
