/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  Link,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import * as actions from './actions.jsx';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const mapStateToProps = (state) => {
  const props = {
    state,
    channels: state.channels,
    currentId: state.currentId,
    messages: state.messages,
  };
  return props;
};

const actionCreators = {
  addUser: actions.addUser,
  fetchChannels: actions.fetchChannels,
};

const SignUp = ({ addUser }) => {
  const t = useTranslation();
  const Schema = Yup.object().shape({
    username: Yup.string().required(t.t('validation_error')).min(3, t.t('Between3and20')).max(20, t.t('Between3and20')),
    password: Yup.string().required(t.t('validation_error')).min(6, t.t('Minimun6')),
    confirmPassword: Yup.string().when('password', {
      is: (val) => (!!(val && val.length > 0)),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Both password need to be the same',
      ),
    }),
  });
  const auth = useAuth();
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Schema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setError(null);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        const body = res.config.data;
        await addUser({ body });
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setError(t('This user aleready exists'));
          inputRef.current.select();
        } else {
          setError(t('Unrecognized error'));
        }
      }
    },
  });

  return (
    <>
      <div className="container">
        <Link to="/" className="navbar-brand">Hexlet Chat</Link>
      </div>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src="data:image" className="rounded-circle" alt="Регистрация" />
                </div>
                <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                  <h1 className="text-center mb-3">{t.t('Registration')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      placeholder={t.t('usernameReg')}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={!!error || (!!formik.errors.username && formik.touched.username)}
                      ref={inputRef}
                    />
                    <Form.Label htmlFor="username">{t.t('usernameReg')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{error || formik.errors.username}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      placeholder={t.t('password')}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={formik.errors.password && formik.touched.password}
                    />
                    <Form.Label htmlFor="password">{t.t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      placeholder={t.t('confirmPassword')}
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="confirmPassword"
                      isInvalid={formik.values.password !== formik.values.confirmPassword && formik.touched.confirmPassword}
                    />
                    <Form.Label htmlFor="confirmPassword">{t.t('confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t.t('PasswordEquility')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button className="w-100 btn btn-outline-primary" type="submit" variant="outline-primary">{t.t('Registration1')}</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(SignUp);
