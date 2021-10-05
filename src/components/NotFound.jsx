import React from 'react';
import { useTranslation } from 'react-i18next';

const notFound = () => {
  const { t } = useTranslation();
  return (
    <div>
      404(
      {t('NotFound')}
    </div>
  );
};
notFound.displayName = 'Not Found';

export default notFound;
