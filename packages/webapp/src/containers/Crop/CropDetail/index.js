import { useSelector } from 'react-redux';
import PureCropDetail from '../../../components/Crop/detail';
import { cropVarietyByID, cropVarietySelector } from '../../cropVarietySlice';
import { useState } from 'react';
import { certifierSurveySelector } from '../../OrganicCertifierSurvey/slice';

function CropDetail({ history, match }) {
  const selectedCrop = useSelector(cropVarietySelector(match.params.variety_id));
  const selectedVariety = useSelector(cropVarietyByID(match.params.variety_id));

  const { interested } = useSelector(certifierSurveySelector);
  const [isEditing, setIsEditing] = useState(false);

  const submitForm = (data) => {
    setIsEditing(false);
  };

  const goBack = () => {
    history.push(`/crop_varieties/crop/${selectedCrop.crop_id}`);
  };

  return (
    <>
      <PureCropDetail
        history={history}
        match={match}
        crop={selectedCrop}
        variety={selectedVariety}
        isEditing={isEditing}
        isInterestedInOrganic={interested}
        setIsEditing={setIsEditing}
        submitForm={submitForm}
        onBack={goBack}
      />
    </>
  );
}

export default CropDetail;
