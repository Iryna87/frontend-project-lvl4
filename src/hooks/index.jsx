import { useContext } from 'react';

import { authContext, socketContext } from '../contexts/index.jsx';

const useAuth = () => useContext(authContext);
const useSocket = () => useContext(socketContext);

export { useAuth, useSocket };
