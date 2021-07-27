/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useAuth from '../hooks/index.jsx';
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
  addChannel: actions.addChannel,
  addMessage: actions.addMessage,
  removeChannel: actions.removeChannel,
  changeId: actions.changeId,
};

const Home = ({
  channels,
  currentId,
  messages,
  state,
  changeId,
  socket,
  t,
}) => {
  console.log(state);
  const auth = useAuth();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const names = channels?.map((channel) => channel.name);

  const addNewChannel = async (e) => {
    e.preventDefault();
    const { name } = Object.fromEntries(new FormData(e.target));
    const differenses = names.filter((item) => item === name);
    if (differenses.length > 0 || name.length > 50) {
      throw new Error('This name alleready exists or is too long');
    } else {
      try {
        await socket.emit('newChannel', { name });
      } catch (err) {
        throw new Error();
      }
    }
  };

  const removeNewChannel = async (e) => {
    e.preventDefault();
    const result = channels.filter(({ id }) => id === currentId);
    const { id, removable } = result[0];
    if (removable !== true) {
      throw new Error('This channel is not removable');
    } else {
      try {
        await socket.emit('removeChannel', { id });
      } catch (err) {
        throw new Error();
      }
    }
  };

  const renameNewChannel = async (e) => {
    console.log(e.target);
    e.preventDefault();
    const { name } = Object.fromEntries(new FormData(e.target));
    const differenses = names.filter((item) => item === name);
    if (differenses.length > 0) {
      throw new Error('This name alleready exists');
    } else {
      try {
        await socket.emit('renameChannel', { id: currentId, name });
      } catch (err) {
        throw new Error();
      }
    }
  };

  const addNewMessage = async (e) => {
    e.preventDefault();
    const obj = new FormData(e.target);
    const body = obj.get('body');
    if (body.length > 50 || messages.length > 50) {
      throw new Error('This message is too long or too many messages exist alleready');
    } else {
      try {
        await socket.emit('newMessage', { body, channelId: currentId });
      } catch (err) {
        throw new Error();
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
        throw new Error();
      }
    }
  };

  const handleCloseButton = () => (
    auth.loggedIn ? auth.logOut() : <Button as={Link} to="/login">Log in</Button>
  );

  const func1 = (e) => {
    changeCurrentId(e);
    handleShow1();
  };

  const func3 = (e) => {
    handleClose3();
    removeNewChannel(e);
  };

  const func4 = () => {
    handleClose1();
    handleShow3();
  };

  const func5 = () => {
    handleClose1();
    handleShow2();
  };

  const currentNameArr = Array.isArray(channels) ? channels?.filter((channel) => channel.id === parseInt(currentId, 10)) : '';

  const msgLengthArr = messages?.filter((message) => parseInt(message.currentId, 10) === currentId);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title h4">{t('AddChannel')}</div>
            <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addNewChannel}>
            <div className="form-group">
              <input name="name" data-testid="add-channel" className="mb-2 form-control" ref={inputRef} />
              <div className="invalid-feedback" />
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={handleClose}>{t('Cancel')}</button>
              <button type="submit" className="btn btn-primary" onClick={handleClose}>{t('Send')}</button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Body>
          <div className="d-flex justify-content-end">
            <a href="#" className="dropdown-item" role="button" onClick={func4}>{t('Remove')}</a>
            <a href="#" className="dropdown-item" role="button" onClick={func5}>{t('Rename')}</a>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} onSubmit={renameNewChannel}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title h4">{t('RenameChannel')}</div>
            <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="form-group">
              <input name="name" data-testid="add-channel" className="mb-2 form-control" ref={inputRef} />
              <div className="invalid-feedback" />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" disabled={!show2} onClick={handleClose2}>{t('Rename')}</button>
              <button type="button" className="me-2 btn btn-secondary" onClick={handleClose2}>{t('Cancel')}</button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title h4">{t('RemoveChannel')}</div>
            <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end">
            <a href="#" className="dropdown-item" role="button" disabled={!show3} onClick={func3}>{t('Remove')}</a>
            <a href="#" className="dropdown-item" role="button" onClick={handleClose3}>{t('Cancel')}</a>
          </div>
        </Modal.Body>
      </Modal>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
              <button type="button" onClick={handleCloseButton} className="btn btn-primary">{t('Exit')}</button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>{t('Channels')}</span>
                  <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleShow}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    <span className="visually-hidden" />
                  </button>
                </div>
                <ul className="nav flex-column nav-pills nav-fill px-2">
                  {Array.isArray(channels) ? channels.map(({ id, name }) => (
                    <li key={id} className="nav-item w-100">
                      <div role="group" className="d-flex show dropdown btn-group">
                        <button type="button" data-id={id} className={id === parseInt(currentId, 10) ? 'w-100 rounded-0 text-start btn btn-secondary' : 'w-100 rounded-0 text-start btn'} onClick={changeCurrentId}>
                          <span className="me-1">#</span>
                          {name}
                        </button>
                        <button aria-haspopup="true" aria-expanded="true" data-id={id} type="button" className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn" onClick={func1} />
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
                        <input name="body" data-testid="new-message" placeholder={t('EnterMessage')} ref={inputRef} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg>
                            <span className="visually-hidden">{t('Send')}</span>
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
