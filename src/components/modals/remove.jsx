/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.jsx';

const Remove = ({
  hideModal, modals,
}) => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const apiSocket = useSocket();

  const channels = useSelector((state) => state.channels.channels);
  const currentId = useSelector((state) => state.channels.currentChannelId);

  const removeNewChannel = async (e) => {
    e.preventDefault();
    dispatch(hideModal());
    const result = channels.filter(({ id }) => id === currentId);
    const { id } = result[0];
    if (id === 1 || id === 2) {
      throw new Error('This channel is not removable');
    } else {
      await apiSocket.removeChannel({ id });
    }
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <div className="modal-title h4">{t.t('RemoveChannel')}</div>
        <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" onClick={hideModal} />
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <button type="button" className="dropdown-item" onClick={hideModal}>{t.t('Cancel')}</button>
          <button type="button" className="dropdown-item" disabled={!modals} onClick={removeNewChannel}>{t.t('Remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
