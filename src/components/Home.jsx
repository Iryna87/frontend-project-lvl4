import React from 'react';
import { connect } from 'react-redux';
import * as actions from './actions.jsx';

const mapStateToProps = (state) => {
  const props = {
    state,
    channels: state.channels,
    currentId: state.currentId,
    messages: state.messages.messages,
  };
  return props;
};

const actionCreators = {
  addChannel: actions.addChannel,
  addMessage: actions.addMessage,
  changeId: actions.changeId,
};

const Home = ({
  channels,
  currentId,
  messages,
  state,
  addChannel,
  changeId,
}) => {
  const addNewChannel = async (e) => {
    e.preventDefault();
    const { name } = Object.fromEntries(new FormData(e.target));
    console.log(name);
    try {
      await addChannel(name);
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  };

  const changeCurrentId = async (e) => {
    const { id } = e.target.dataset;
    console.log(id);
    try {
      await changeId(id);
    } catch (err) {
      throw new Error();
    }
  };

  const currentNameArr = channels?.filter((channel) => channel.id === parseInt(currentId, 10));

  const messagesLengthArr = messages?.filter((message) => message.id === parseInt(currentId, 10));

  const changeModalModus = () => {
    const container = document.querySelector('.container-lg');
    const modal = document.querySelector('#modal');
    const dialog = document.querySelector('#dialog');
    modal.classList.add('show');
    dialog.classList.remove('fade');
    dialog.classList.remove('modal');
    dialog.classList.remove('show');
    container.setAttribute('aria-hidden', 'true');
  };

  console.log('channels', channels, state);

  return (
    <>
      <div id="modal" className="modal fade" />
      <div role="dialog" id="dialog" aria-modal="true" className="fade modal show" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Добавить канал</div>
              <button aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
            </div>
            <div className="modal-body">
              <form className="" onSubmit={addNewChannel}>
                <div className="form-group">
                  <input name="name" data-testid="add-channel" className="mb-2 form-control" />
                  <div className="invalid-feedback" />
                  <div className="d-flex justify-content-end">
                    <button type="button" className="me-2 btn btn-secondary">Отменить</button>
                    <button type="submit" className="btn btn-primary">Отправить</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
              <button type="button" className="btn btn-primary">Выйти</button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>Каналы</span>
                  <button type="button" data-toggle="modal" data-target="#modal" className="p-0 text-primary btn btn-group-vertical" onClick={changeModalModus}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    <span className="visually-hidden" />
                  </button>
                </div>
                <ul className="nav flex-column nav-pills nav-fill px-2">
                  {channels?.map(({ id, name }) => (
                    <li key={id} className="nav-item w-100">
                      <button type="button" data-id={id} className={id === parseInt(currentId, 10) ? 'w-100 rounded-0 text-start btn btn-secondary' : 'w-100 rounded-0 text-start btn'} onClick={changeCurrentId}>
                        <span className="me-1">#</span>
                        {name}
                      </button>
                    </li>
                  ))}
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
                      {messagesLengthArr.length === 0 ? 0 : messagesLengthArr.length}
                      {' '}
                      сообщений
                    </span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                    {messages?.map((message) => (
                      <li key={message.id} className="nav-item w-100">{message.name}</li>
                    ))}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <form noValidate="" className="py-1 border rounded-2">
                      <div className="input-group has-validation">
                        <input className="body" data-testid="new-message" placeholder="Введите сообщение..." />
                        <div className="input-group-append">
                          <button disabled="" type="submit" className="btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg>
                            <span className="visually-hidden">Отправить</span>
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
