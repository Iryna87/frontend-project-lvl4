/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.jsx';

const Remove = ({
  hideModal, modals,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiSocket = useSocket();

  const removeChannel = async (e) => {
    e.preventDefault();
    const id = modals.extraData;
    dispatch(hideModal());
    if (id === 1 || id === 2) {
      throw new Error(t('ThisСhannelIsNotRemovable'));
    } else {
      await apiSocket.removeChannel({ id });
    }
  };

  return (
    <>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <button type="button" className="dropdown-item" onClick={hideModal}>{t('Cancel')}</button>
          <button type="button" className="dropdown-item" disabled={!modals} onClick={removeChannel}>{t('Remove')}</button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
