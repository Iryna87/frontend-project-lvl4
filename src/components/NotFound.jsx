import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div>
      404(
      {t('errors.NotFound')}
    </div>
  );
};
NotFound.displayName = 'Not Found';

export default NotFound;
