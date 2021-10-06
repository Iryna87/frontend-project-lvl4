import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.jsx';

const Header = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <>
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          {auth.loggedIn ? (
            <>
              <Link to="/" className="navbar-brand">Hexlet Chat</Link>
              <Button type="button" onClick={auth.logOut} className="btn btn-primary">{t('Exit')}</Button>
            </>
          )
            : <Link to="/" className="navbar-brand">Hexlet Chat</Link>}

        </div>
      </Nav>
    </>
  );
};

export default Header;
