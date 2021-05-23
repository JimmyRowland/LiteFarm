import React from 'react';
import PureSetCertificationSummary from '../../../components/SetCertificationSummary';
import { useDispatch, useSelector } from 'react-redux';
import { patchStepFour } from '../saga';
import history from '../../../history';
import {
  selectedCertifierSelector,
  selectedCertificationSelector,
  requestedCertifierSelector,
  allCertifierTypesSelector,
  allCertificationTypesSelector,
} from '../organicCertifierSurveySlice';

export default function SetCertificationSummary() {
  const dispatch = useDispatch();
  const certifierType = useSelector(selectedCertifierSelector);
  const requestedCertifierData = useSelector(requestedCertifierSelector);
  const certificationType = useSelector(selectedCertificationSelector);
  const allSupportedCertificationTypes = useSelector(allCertificationTypesSelector);
  const selectedCertificationTranslation = allSupportedCertificationTypes.find(
    (cert) => cert.certification_id === certificationType.certificationID,
  )?.certification_translation_key;
  const allSupportedCertifierTypes = useSelector(allCertifierTypesSelector);

  const onSubmit = () => {
    dispatch(patchStepFour());
  };

  const onGoBack = () => {
    certificationType.certificationName === 'Other'
      ? history.push('/requested_certifier')
      : allSupportedCertifierTypes.length < 1
      ? history.push('/requested_certifier')
      : history.push('/certifier_selection_menu');
  };

  return (
    <>
      <PureSetCertificationSummary
        name={requestedCertifierData ? requestedCertifierData : certifierType.certifierName}
        requestedCertifierData={requestedCertifierData}
        onSubmit={onSubmit}
        onGoBack={onGoBack}
        allSupportedCertificationTypes={allSupportedCertificationTypes}
        certificationType={certificationType}
        certificationTranslation={selectedCertificationTranslation}
      />
    </>
  );
}
