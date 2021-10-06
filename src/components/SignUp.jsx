import axios from 'axios';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import myImage from '../images/signUp.jpg';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';
import Header from './Header.jsx';

const SignUp = () => {
  const { t } = useTranslation();
  const Schema = Yup.object().shape({
    username: Yup.string().required(t('validation_error')).min(3, t('Between3and20')).max(20, t('Between3and20')),
    password: Yup.string().required(t('validation_error')).min(6, t('Minimun6')),
    confirmPassword: Yup.string().when('password', {
      is: (val) => (!!(val && val.length > 0)),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Both password need to be the same',
      ),
    }),
  });
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      errors: '',
    },
    validationSchema: Schema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      formik.values.errors = '';
      try {
        const result = await axios.post(routes.signUpPath(), values);
        auth.logIn(result.data);
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          formik.values.errors = t('ThisUserAlreadyExists');
        } else {
          formik.values.errors = t('UnrecognizedError');
        }
      }
    },
  });

  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={myImage} className="rounded-circle" alt="Регистрация" />
                </div>
                <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                  <h1 className="text-center mb-3">{t('Registration')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      placeholder={t('usernameReg')}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={!!formik.values.errors
                      || (!!formik.errors.username && formik.touched.username)}
                      autoFocus
                    />
                    <Form.Label htmlFor="username">{t('usernameReg')}</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {formik.values.errors
                    || formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      placeholder={t('password')}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={formik.errors.password && formik.touched.password}
                    />
                    <Form.Label htmlFor="password">{t('password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      placeholder={t('confirmPassword')}
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="confirmPassword"
                      isInvalid={formik.values.password !== formik.values.confirmPassword
                      && formik.touched.confirmPassword}
                    />
                    <Form.Label htmlFor="confirmPassword">{t('confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t('PasswordEquility')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button className="w-100 btn btn-outline-primary" type="submit" variant="outline-primary">{t('Registration1')}</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
