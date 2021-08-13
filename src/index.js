import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import init from './init.jsx';

const socket = io();

const app = async () => {
  const vdom = await init(socket);
  ReactDOM.render(vdom, document.querySelector('#chat'));
};
app();
