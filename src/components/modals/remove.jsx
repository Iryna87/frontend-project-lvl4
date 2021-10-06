import React from 'react';
import { useFormik } from 'formik';
import { Form, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.jsx';
import { getModalExtraData } from '../../selectors.js';

const Remove = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const extraData = useSelector(getModalExtraData);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      const id = extraData;
      if (id === 1 || id === 2) {
        return;
      }
      await apiSocket.removeChannel({ id });
      hideModal();
    },
  });
  return (
    <>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <p className="lead">Уверены?</p>
          <Form.Group className="d-flex justify-content-end">
            <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
            <Button type="submit" variant="danger" disabled={formik.isSubmitting}>{t('Remove')}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Remove;
