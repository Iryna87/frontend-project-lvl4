import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { actions } from '../slices/index.js';

const ChannelsHome = ({
  addChannelModal,
  removeChannelModal,
  renameChannelModal,
  channels,
  currentId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showMode, handleShow] = useState(false);
  const showDropDown = () => handleShow(true);
  const hideDropDown = () => handleShow(false);

  const changeCurrentId = (e) => {
    const { id } = e.target.dataset;
    if (id) {
      dispatch(actions.changeCurrentChannelId({ id }));
    } else {
      throw new Error();
    }
  };

  const activeChannel = channels?.find(({ id }) => id === currentId);

  const handleRemove = () => {
    hideDropDown();
    removeChannelModal(activeChannel.id);
  };
  const handleRename = () => {
    hideDropDown();
    renameChannelModal();
  };
  const handleAdd = () => {
    hideDropDown();
    addChannelModal();
  };

  const handleDropDown = async (e) => {
    await changeCurrentId(e);
    await showDropDown();
  };

  return (
    <>
      <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
        <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
          <span>{t('Channels')}</span>
          <Button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleAdd}>
            <PlusSquare width="17" height="17" />
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul className="nav flex-column nav-pills nav-fill px-2">
          {Array.isArray(channels) ? channels.map(({ id, name, removable }) => (
            <li key={id} className="nav-item w-100">
              <div role="group" className={showMode ? 'd-flex show dropdown btn-group' : 'd-flex dropdown btn-group'}>
                <Button
                  type="button"
                  data-id={id}
                  className={id === currentId ? 'w-100 rounded-0 text-start btn btn-secondary' : 'w-100 rounded-0 text-start btn'}
                  onClick={changeCurrentId}
                >
                  <span className="me-1">#</span>
                  {name}
                </Button>
                {removable
                  ? (
                    <Button
                      type="button"
                      data-id={id}
                      className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
                      aria-haspopup="true"
                      aria-expanded={showMode}
                      onClick={handleDropDown}
                    />
                  ) : ''}
                <div x-placement="bottom-start" aria-labelledby="" className={showMode && id === currentId ? 'dropdown-menu show' : 'dropdown-menu'}>
                  <Button type="button" className="dropdown-item" onClick={handleRename}>{t('Rename')}</Button>
                  <Button type="button" className="dropdown-item" onClick={handleRemove}>{t('Remove')}</Button>
                </div>
              </div>
            </li>
          )) : ''}
        </ul>
      </div>
    </>
  );
};

export default ChannelsHome;
