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
      await socket.emit('removeChannel', { id }, (response) => {
        console.log(response.status);
      });
    } catch (err) {
      if (err) {
        throw err;
      }
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
          <button type="button" className="dropdown-item" disabled={!modalData} onClick={removeNewChannel}>{t('Remove')}</button>
          <button type="button" className="dropdown-item" onClick={hideModal}>{t('Cancel')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, actionCreators)(Remove);
