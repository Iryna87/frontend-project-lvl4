import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSocket, useChannelValidationSchema } from '../../hooks';
import { getModalExtraData } from '../../selectors.js';

const Rename = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const channelId = useSelector(getModalExtraData);
  const validationSchema = useChannelValidationSchema();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { name } = values;
      await apiSocket.renameChannel({ id: channelId, name });
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
              data-testid="rename-channel"
              className="mb-2"
              ref={inputRef}
              isInvalid={formik.errors.name}
            />
            <div className="d-flex justify-content-end">
              <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>{t('Rename')}</Button>
            </div>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
