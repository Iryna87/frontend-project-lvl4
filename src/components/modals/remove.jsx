import React from 'react';
import { useFormik } from 'formik';
import { Form, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks';
import { getModalExtraData } from '../../selectors.js';

const NOT_REMOVABLE_CHANNEL_IDS = [1, 2];

const Remove = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const extraData = useSelector(getModalExtraData);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      const id = extraData;
      if (id in NOT_REMOVABLE_CHANNEL_IDS) {
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
          <p className="lead">{t('AreYouSure')}</p>
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
