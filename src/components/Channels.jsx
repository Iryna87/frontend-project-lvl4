import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { actions } from '../slices/index.js';
import { getChannels, getCurrentChannelId } from '../selectors.js';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const addChannelModal = () => dispatch(actions.showModal({ type: 'adding' }));
  const removeChannelModal = (id) => dispatch(actions.showModal({ type: 'removing', extraData: id }));
  const renameChannelModal = (id) => dispatch(actions.showModal({ type: 'renaming', extraData: id }));

  const channels = useSelector(getChannels);
  const currentId = useSelector(getCurrentChannelId);

  const changeCurrentId = (e) => {
    const { id } = e.target.dataset;
    dispatch(actions.changeCurrentChannelId({ id }));
  };

  const makeHandleRemove = (channelId) => () => removeChannelModal(channelId);
  const makeHandleRename = (channelId) => () => renameChannelModal(channelId);

  return (
    <>
      <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
        <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
          <span>{t('Channels')}</span>
          <Button type="button" className="p-0 text-primary" variant="" onClick={addChannelModal}>
            <PlusSquare width="17" height="17" />
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul className="nav flex-column nav-pills nav-fill px-2">
          {Array.isArray(channels) ? channels.map(({ id, name, removable }) => (
            <li key={id} className="nav-item w-100">
              <Dropdown as={ButtonGroup} className="d-flex">
                <Button
                  type="button"
                  data-id={id}
                  variant={id === currentId ? 'secondary' : ''}
                  className="w-100 rounded-0 text-start text-truncate"
                  onClick={changeCurrentId}
                >
                  <span className="me-1">#</span>
                  {name}
                </Button>
                {removable
                  ? (
                    <Dropdown.Toggle
                      className="flex-grow-0"
                      split
                      variant={id === currentId ? 'secondary' : ''}
                    />
                  ) : ''}
                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={makeHandleRename(id)}>{t('Rename')}</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={makeHandleRemove(id)}>{t('Remove')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )) : ''}
        </ul>
      </div>
    </>
  );
};

export default Channels;
