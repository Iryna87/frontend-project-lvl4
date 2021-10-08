import axios from 'axios';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';
import myImage from '../images/login.jpg';
import routes from '../routes.js';
import Header from './Header.jsx';

export default () => {
  const { t } = useTranslation();
  const Schema = Yup.object().shape({
    username: Yup.string().required(t('validation.Required')),
    password: Yup.string().required(t('validation.Required')),
  });
  const { logIn } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      errors: false,
    },
    validationSchema: Schema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      formik.values.errors = false;
      try {
        const result = await axios.post(routes.loginPath(), values);
        logIn(result.data);
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          formik.values.errors = true;
          return;
        }
        throw err;
      }
    },
  });
  return (
    <>
      <Header />
      <div className="row justify-content-center pt-5">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={myImage} className="rounded-circle" alt="Войти" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('Enter')}</h1>
                <Form.Group className="form-floating mb-3 form-group">
                  <Form.Control
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder={t('signup.username')}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={formik.values.errors
                    || (formik.errors.username && formik.touched.username)}
                    autoFocus
                  />
                  <Form.Label htmlFor="username">{t('username')}</Form.Label>
                  <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-4 form-group">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('signup.password')}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    isInvalid={formik.values.errors
                    || (formik.errors.password && formik.touched.password)}
                  />
                  <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
                  <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  {formik.values.errors ? <Form.Control.Feedback type="invalid">{t('validation.Incorrect')}</Form.Control.Feedback> : '' }
                </Form.Group>
                <Button className="w-100 mb-3 btn btn-outline-primary" type="submit" variant="outline-primary">{t('Enter')}</Button>
              </Form>
            </div>
          </div>
          <div className="card-footer p-4">
            <div className="text-center">
              <span>Нет аккаунта?</span>
              {' '}
              <Link to="/signup">{t('Registration')}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
