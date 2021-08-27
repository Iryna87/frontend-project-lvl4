/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
  t,
  addChannelModal,
  removeChannelModal,
  renameChannelModal,
}) => {
  const auth = useAuth();
  const apiSocket = useSocket();
  const [showMode, handleShow] = useState(false);
  const showDropDown = () => handleShow(true);
  const hideDropDown = () => handleShow(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const activeChannel = channels.find(({ id }) => id === currentId);

  const addNewMessage = async (e) => {
    e.preventDefault();
    const obj = new FormData(e.target);
    const body = obj.get('body');
    if (body.length > 50 || messages.length > 50) {
      throw new Error('This message is too long or too many messages exist alleready');
    } else {
      try {
        apiSocket.newMessage({ body, channelId: currentId });
      } catch (err) {
        if (err) {
          throw err;
        }
      }
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

  const currentNameArr = Array.isArray(channels) ? channels?.filter((channel) => channel.id === currentId) : '';
  const msgLengthArr = messages?.filter((message) => message.channelId === currentId);

  return (
    <>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <Link to="/" className="navbar-brand">Hexlet Chat</Link>
              <button type="button" onClick={handleCloseButton} className="btn btn-primary">{t('Exit')}</button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>{t('Channels')}</span>
                  <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleAdd}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      <span className="visually-hidden">+</span>
                    </svg>
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
                        {removable ? <button aria-haspopup="true" aria-expanded={showMode} type="button" className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn" onClick={showDropDown} /> : ''}
                        <div x-placement="bottom-start" aria-labelledby="" className={showMode && id === currentId ? 'dropdown-menu show' : 'dropdown-menu'}>
                          <button type="button" className="dropdown-item" onClick={handleRename}>{t('Rename')}</button>
                          <button type="button" className="dropdown-item" onClick={handleRemove}>{t('Remove')}</button>
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
                      parseInt(message.channelId, 10) === currentId ? <li key={message.id} className="nav-item w-100">{message.body}</li> : ''
                    ))}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <form noValidate="" className="py-1 border rounded-2" onSubmit={addNewMessage}>
                      <div className="input-group has-validation">
                        <input name="body" data-testid="new-message" className="border-0 p-0 ps-2 form-control" placeholder={t('EnterMessage')} ref={inputRef} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg>
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
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(Home);
