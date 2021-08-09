import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as actions from '../actions.jsx';

const actionCreators = {
  addChannel: actions.addChannel,
  addMessage: actions.addMessage,
  removeChannel: actions.removeChannel,
  changeId: actions.changeId,
};

const mapStateToProps = (state) => {
  const props = {
    state,
    channels: state.channels,
    currentId: state.currentId,
  };
  return props;
};

const Rename = ({
  hideModal, modalData, channels, t, socket, currentId,
}) => {
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
        await socket.emit('renameChannel', { id: currentId, name });
      } catch (err) {
        throw new Error();
      }
    }
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="modal-title h4">{t('RenameChannel')}</div>
          <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={renameNewChannel}>
          <div className="form-group">
            <input name="name" data-testid="add-channel" className="mb-2 form-control" ref={inputRef} />
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

export default connect(mapStateToProps, actionCreators)(Rename);
