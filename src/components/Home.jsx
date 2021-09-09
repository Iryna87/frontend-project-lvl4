/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PlusSquare, ArrowRightSquare } from 'react-bootstrap-icons';
import { useAuth, useSocket } from '../hooks/index.jsx';
import * as actions from './actions.jsx';

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
  changeId: actions.changeId,
};

const Home = ({
  channels,
  currentId,
  messages,
  changeId,
  addChannelModal,
  removeChannelModal,
  renameChannelModal,
}) => {
  const t = useTranslation();
  const auth = useAuth();
  const apiSocket = useSocket();
  const [showMode, handleShow] = useState(false);
  const showDropDown = () => handleShow(true);
  const hideDropDown = () => handleShow(false);

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [messages]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeChannel = channels.find(({ id }) => id === currentId);

  const addNewMessage = (e) => {
    e.preventDefault();
    const obj = new FormData(e.target);
    const body = obj.get('body');
    try {
      apiSocket.newMessage({ body, channelId: currentId, name: activeChannel.name });
    } catch (err) {
      if (err) {
        throw err;
      }
    }
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = '';
    }
  };

  const changeCurrentId = async (e) => {
    const { id } = e.target.dataset;
    if (!id) {
      throw new Error();
    } else {
      try {
        await changeId(parseInt(id, 10));
      } catch (err) {
        if (err) {
          throw err;
        }
      }
    }
  };

  const handleCloseButton = () => (
    auth.loggedIn ? auth.logOut() : <Button as={Link} to="/login">Log in</Button>
  );
  const handleRemove = () => {
    hideDropDown();
    removeChannelModal(activeChannel.id);
  };
  const handleRename = () => {
    hideDropDown();
    renameChannelModal(activeChannel.id, activeChannel.name);
  };
  const handleAdd = (name) => {
    hideDropDown();
    addChannelModal(name);
  };

  const handleDropDown = async (e) => {
    await changeCurrentId(e);
    await showDropDown();
  };

  const currentNameArr = Array.isArray(channels) ? channels?.filter((channel) => channel.id === currentId) : '';
  const msgLengthArr = messages?.filter((message) => message.channelId === currentId);

  return (
    <>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <Link to="/" className="navbar-brand">Hexlet Chat</Link>
              <button type="button" onClick={handleCloseButton} className="btn btn-primary">{t.t('Exit')}</button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>{t.t('Channels')}</span>
                  <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleAdd}>
                    <PlusSquare width="17" height="17" />
                  </button>
                </div>
                <ul className="nav flex-column nav-pills nav-fill px-2">
                  {Array.isArray(channels) ? channels.map(({ id, name, removable }) => (
                    <li key={id} className="nav-item w-100">
                      <div role="group" className={showMode ? 'd-flex show dropdown btn-group' : 'd-flex dropdown btn-group'}>
                        <button type="button" data-id={id} className={id === currentId ? 'w-100 rounded-0 text-start btn btn-secondary' : 'w-100 rounded-0 text-start btn'} onClick={changeCurrentId}>
                          <span className="me-1">#</span>
                          {name}
                        </button>
                        {removable ? <button type="button" data-id={id} className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn" aria-haspopup="true" aria-expanded={showMode} onClick={handleDropDown} /> : ''}
                        <div x-placement="bottom-start" aria-labelledby="" className={showMode && id === currentId ? 'dropdown-menu show' : 'dropdown-menu'}>
                          <button type="button" className="dropdown-item" onClick={handleRename}>{t.t('Rename')}</button>
                          <button type="button" className="dropdown-item" onClick={handleRemove}>{t.t('Remove')}</button>
                        </div>
                      </div>
                    </li>
                  )) : ''}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b>
                        #
                        {' '}
                        {currentNameArr.length === 0 ? '' : currentNameArr[0].name}
                      </b>
                    </p>
                    <span className="text-muted">
                      {msgLengthArr.length === 0 ? 0 : msgLengthArr.length}
                      {' '}
                      сообщений
                    </span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                    {messages?.map((message) => (
                      message.channelId === currentId ? (
                        <div key={message.id} className="ntext-break mb-2">
                          <b>{message.name}</b>
                          :
                          {' '}
                          {message.body}
                        </div>
                      ) : ''
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <Form noValidate="" className="py-1 border rounded-2" autoComplete="off" onSubmit={addNewMessage}>
                      <Form.Group>
                        <div className="input-group has-validation">
                          <input name="body" data-testid="new-message" maxLength="50" className="border-0 p-0 ps-2 form-control" placeholder={t.t('EnterMessage')} ref={inputRef} />
                          <div className="input-group-append">
                            <button type="submit" className="btn btn-group-vertical">
                              <ArrowRightSquare width="20" height="20" />
                              <span className="visually-hidden">{t.t('Send')}</span>
                            </button>
                          </div>
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid" />
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(Home);
