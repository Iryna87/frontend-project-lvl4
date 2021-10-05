import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.jsx';

const Header = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  const handleCloseButton = () => (
    auth.loggedIn ? auth.logOut() : <Button as={Link} to="/login">Log in</Button>
  );

  return (
    <>
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link to="/" className="navbar-brand">Hexlet Chat</Link>
          <Button type="button" onClick={handleCloseButton} className="btn btn-primary">{t('Exit')}</Button>
        </div>
      </Nav>
    </>
  );
};

export default Header;
