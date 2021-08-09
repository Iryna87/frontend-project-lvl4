/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import * as actions from '../actions.jsx';

const actionCreators = {
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

const Remove = ({
  hideModal, modalData, socket, t, channels, currentId, changeId,
}) => {
  const removeNewChannel = async (e) => {
    e.preventDefault();
    hideModal();
    changeId(1);
    const result = channels.filter(({ id }) => id === currentId);
    const { id } = result[0];
    try {
      await socket.emit('removeChannel', { id });
    } catch (err) {
      throw new Error();
    }
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="modal-title h4">{t('RemoveChannel')}</div>
          <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <a href="#" className="dropdown-item" role="button" disabled={!modalData} onClick={removeNewChannel}>{t('Remove')}</a>
          <a href="#" className="dropdown-item" role="button" onClick={hideModal}>{t('Cancel')}</a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, actionCreators)(Remove);
