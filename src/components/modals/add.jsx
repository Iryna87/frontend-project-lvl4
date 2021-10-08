import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSocket, useChannelValidationSchema } from '../../hooks';
import { actions } from '../../slices/index.js';

const Add = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const validationSchema = useChannelValidationSchema();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
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
              isInvalid={formik.errors.name}
            />
            <div className="d-flex justify-content-end">
              <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>{t('Send')}</Button>
            </div>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
