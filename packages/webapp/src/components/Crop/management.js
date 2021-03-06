import Layout from '../Layout';
import CropHeader from './cropHeader';
import RouterTab from '../RouterTab';
import React from 'react';
import { Semibold, Underlined } from '../Typography';
import { useTranslation } from 'react-i18next';

function PureCropManagement({ history, match, crop, onBack, variety }) {
  const { t } = useTranslation();
  return (
    <Layout>
      <CropHeader {...crop} onBackClick={onBack} supplierName={variety.supplier} />
      <RouterTab
        classes={{ container: { margin: '24px 0 26px 0' } }}
        history={history}
        match={match}
        tabs={[
          {
            label: t('CROP_DETAIL.MANAGEMENT_TAB'),
            path: `/crop/${match.params.variety_id}/management`,
          },
          {
            label: t('CROP_DETAIL.DETAIL_TAB'),
            path: `/crop/${match.params.variety_id}/detail`,
          },
        ]}
      />
      <Semibold style={{ marginBottom: '16px' }}>{t('CROP_DETAIL.MANAGEMENT_PLANS')}</Semibold>
      <Underlined>+ {t('CROP_DETAIL.ADD_PLAN')}</Underlined>
    </Layout>
  );
}

export default PureCropManagement;
