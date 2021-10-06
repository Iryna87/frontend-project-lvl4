import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getModals } from '../selectors.js';
import { actions } from '../slices/index.js';
import getModal from './modals/index.js';

const ModalComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hideModal = () => dispatch(actions.hideModal({}));
  const modals = useSelector(getModals);

  if (modals.isOpen === false) {
    return null;
  }
  const Component = getModal(modals.type);
  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <div className="modal-title h4">{t(`modals.${modals.type}.title`)}</div>
        <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" onClick={hideModal} />
      </Modal.Header>
      <Component hideModal={hideModal} />
    </Modal>
  );
};

export default ModalComponent;
