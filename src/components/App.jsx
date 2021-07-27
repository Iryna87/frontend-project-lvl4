import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import locales from '../locales/index.js';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Home from './Home.jsx';
import NotFound from './NotFound.jsx';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: locales,
    interpolation: {
      escapeValue: false,
    },
  });

const AuthProvider = ({ children }) => {
  const token = !!localStorage.userId;
  const [loggedIn, setLoggedIn] = useState(token);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();
  return (
    <Route
      path={path}
      render={() => (auth.loggedIn ? children : <Redirect to={{ pathname: '/login' }} />)}
    />
  );
};

const App = ({ socket }) => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Switch>
            <Route path="/login">
              <Login t={t} />
            </Route>
            <Route path="/signup">
              <SignUp t={t} />
            </Route>
            <PrivateRoute path="/">
              <Home socket={socket} t={t} />
            </PrivateRoute>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
