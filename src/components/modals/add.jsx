import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSocket } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const Add = ({ modals, hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const addChannel = async (e) => {
    e.preventDefault();
    dispatch(actions.hideModal());
    const { name } = Object.fromEntries(new FormData(e.target));
    const result = await apiSocket.newChannel({ name });
    const { id } = result.data;
    dispatch(actions.changeCurrentChannelId({ id }));
  };

  return (
    <>
      <Modal.Body>
        <Form onSubmit={addChannel}>
          <div className="form-group">
            <input name="name" data-testid="add-channel" className="mb-2 form-control" ref={inputRef} />
            <div className="invalid-feedback" />
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={hideModal}>{t('Cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={!modals}>{t('Send')}</button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
