import React, { useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSocket } from '../../hooks/index.jsx';
import { changeId } from '../../actions/actions.jsx';

const mapStateToProps = (state) => {
  const props = {
    channels: state.channels,
  };
  return props;
};

const Add = ({ hideModal }) => {
  const dispatch = useDispatch();
  const t = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  const addNewChannel = async (e) => {
    e.preventDefault();
    hideModal();
    const { name } = Object.fromEntries(new FormData(e.target));
    const result = await apiSocket.newChannel({ name });
    dispatch(changeId(parseInt(result?.data?.id, 10)));
  };

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <div className="modal-title h4">{t.t('AddChannel')}</div>
        <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" onClick={hideModal} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addNewChannel}>
          <div className="form-group">
            <input name="name" data-testid="add-channel" className="mb-2 form-control" ref={inputRef} />
            <div className="invalid-feedback" />
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={hideModal}>{t.t('Cancel')}</button>
              <button type="submit" className="btn btn-primary">{t.t('Send')}</button>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
};

export default connect(mapStateToProps)(Add);
