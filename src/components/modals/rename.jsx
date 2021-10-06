import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSocket } from '../../hooks/index.jsx';
import { getModalExtraData, getChannelById } from '../../selectors.js';

const Rename = ({ hideModal }) => {
  const { t } = useTranslation();
  const apiSocket = useSocket();
  const inputRef = useRef();
  const channelId = useSelector(getModalExtraData);
  const channel = useSelector(getChannelById(channelId));

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      const { name } = values;
      if (name === channel.name) {
        throw new Error(t('ThisNameAlreadyExists'));
      }
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
            />
            <div className="d-flex justify-content-end">
              <Button type="button" className="me-2" variant="secondary" onClick={hideModal}>{t('Cancel')}</Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>{t('Rename')}</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
