import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { authContext, socketContext } from '../contexts';
import { getChannelNames } from '../selectors.js';

export const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(socketContext);

export const useChannelValidationSchema = () => {
  const { t } = useTranslation();
  const channelNames = useSelector(getChannelNames);
  return Yup.object().shape({
    name: Yup
      .string()
      .trim()
      .required(t('validation.Required'))
      .min(3, t('validation.Minimun3'))
      .max(20, t('validation.Maximum20'))
      .notOneOf(channelNames, t('validation.Unique')),
  });
};
