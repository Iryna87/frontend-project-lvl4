import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';

const Header = () => {
  const { t } = useTranslation();
  const { loggedIn, logOut } = useAuth();

  return (
    <>
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link to="/" className="navbar-brand">{t('Brand')}</Link>
          {loggedIn && <Button type="button" onClick={logOut} className="btn btn-primary">{t('Exit')}</Button>}
        </div>
      </Nav>
    </>
  );
};

export default Header;
