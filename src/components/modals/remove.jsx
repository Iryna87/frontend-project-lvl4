/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.jsx';
import * as actions from '../actions.jsx';

const actionCreators = {
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
  hideModal, modalData, channels, currentId, changeId,
}) => {
  const t = useTranslation();
  const apiSocket = useSocket();
  const removeNewChannel = async (e) => {
    e.preventDefault();
    hideModal();
    const result = channels.filter(({ id }) => id === currentId);
    const { id } = result[0];
    if (id === 1 || id === 2) {
      throw new Error('This channel is not removable');
    } else {
      try {
        apiSocket.removeChannel({ id });
      } catch (err) {
        if (err) {
          throw err;
        }
      }
    }
    changeId(1);
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
          <button type="button" className="dropdown-item" disabled={!modalData} onClick={removeNewChannel}>{t.t('Remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connect(mapStateToProps, actionCreators)(Remove);
