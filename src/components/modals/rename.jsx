import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSocket } from '../../hooks/index.jsx';

const mapStateToProps = (state) => {
  const props = {
    state,
    channels: state.channels,
    currentId: state.currentId,
  };
  return props;
};

const Rename = ({
  hideModal, modalData, channels, t, currentId,
}) => {
  const apiSocket = useSocket();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const names = channels?.map((channel) => channel.name);

  const renameNewChannel = async (e) => {
    e.preventDefault();
    hideModal();
    const { name } = Object.fromEntries(new FormData(e.target));
    const differenses = names.filter((item) => item === name);
    if (differenses.length > 0) {
      throw new Error('This name alleready exists');
    } else {
      try {
        apiSocket.renameChannel({ id: currentId, name });
      } catch (err) {
        if (err) {
          throw err;
        }
      }
    }
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <div className="modal-title h4">{t('RenameChannel')}</div>
        <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" onClick={hideModal} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={renameNewChannel}>
          <div className="form-group">
            <input name="name" data-testid="rename-channel" className="mb-2 form-control" ref={inputRef} />
            <div className="invalid-feedback" />
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={!modalData}>{t('Rename')}</button>
            <button type="button" className="me-2 btn btn-secondary" onClick={hideModal}>{t('Cancel')}</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps)(Rename);
