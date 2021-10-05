import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.jsx';
import { getModalExtraData } from '../../selectors.js';

const Remove = ({ hideModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiSocket = useSocket();
  const extraData = useSelector(getModalExtraData);
  const [loading, setLoading] = useState(false);

  const removeChannel = async (e) => {
    e.preventDefault();
    const id = extraData;
    if (id === 1 || id === 2) {
      return;
    }
    try {
      setLoading(true);
      await apiSocket.removeChannel({ id });
      dispatch(hideModal());
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
          <Button type="button" variant="primary" disabled={loading} onClick={removeChannel}>{t('Remove')}</Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
