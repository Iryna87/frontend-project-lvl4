import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from './actions.jsx';
import routes from '../routes.js';

const actionCreators = {
  addTask: actions.addTask,
};

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = ({
  addTask,
  handleSubmit,
  reset,
}) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      setContent(data);
    };

    fetchContent();
  }, []);

  const onSubmit = (values) => {
    const task = { ...values, id: _.uniqueId(), state: 'active' };
    addTask({ task });
    reset();
  };

  console.log(content.channels);

  return (
    <div name="h-100" id="chat">
      <div name="d-flex flex-column h-100">
        <nav name="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div name="container">
            <a name="navbar-brand" href="/">Hexlet Chat</a>
            <button type="button" name="btn btn-primary">Выйти</button>
          </div>
        </nav>
        <div name="container h-100 my-4 overflow-hidden rounded shadow">
          <div name="row h-100 bg-white flex-md-row">
            <div name="col-4 col-md-2 border-end pt-5 px-0 bg-light">
              <div name="d-flex justify-content-between mb-2 ps-4 pe-2">
                <span>Каналы</span>
                <button type="button" name="p-0 text-primary btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <span name="visually-hidden">+</span>
                </button>
              </div>
              <ul name="nav flex-column nav-pills nav-fill px-2">
                {content === '' ? '' : content.channels.forEach((channel) => (
                  <li name="nav-item w-100">
                    <button type="button" name="w-100 rounded-0 text-start btn btn-secondary">
                      <span name="me-1">#</span>
                      {channel.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div name="col p-0 h-100">
              <div name="d-flex flex-column h-100">
                <div name="bg-light mb-4 p-3 shadow-sm small">
                  <p name="m-0">
                    <b># general</b>
                  </p>
                  <span name="text-muted">0 сообщений</span>
                </div>
                <div id="messages-box" name="chat-messages overflow-auto px-5 " />
                <div name="mt-auto px-5 py-3">
                  <form noValidate="" name="py-1 border rounded-2" onSubmit={handleSubmit(onSubmit)}>
                    <div name="input-group has-validation">
                      <input name="body" data-testid="new-message" placeholder="Введите сообщение..." />
                      <div name="input-group-append">
                        <button disabled="" type="submit" name="btn btn-group-vertical">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                          </svg>
                          <span name="visually-hidden">Отправить</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectedNewTaskForm = connect(null, actionCreators)(Home);
export default reduxForm({
  form: 'newTask',
})(ConnectedNewTaskForm);
