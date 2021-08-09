import Add from './add.jsx';
import Rename from './rename.jsx';
import Remove from './remove.jsx';

const modals = {
  adding: Add,
  renaming: Rename,
  removing: Remove,
};

export default (action) => modals[action];
