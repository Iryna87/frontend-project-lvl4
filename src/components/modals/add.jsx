import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSocket } from '../../hooks/index.jsx';
import { actions } from '../../slices/index.js';

const Add = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      const { name } = values;
      const result = await apiSocket.newChannel({ name });
      const { id } = result.data;
      dispatch(actions.changeCurrentChannelId({ id }));
      hideModal();
    },
  });
  return (
    <>
      <Modal.Body>
        <Form autoComplete="off" onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              data-testid="add-channel"
              className="mb-2"
              ref={inputRef}
            />
            <div className="d-flex justify-content-end">
              <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>{t('Send')}</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
