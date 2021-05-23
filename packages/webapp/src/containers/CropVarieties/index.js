import Layout from '../../components/Layout';
import { useTranslation } from 'react-i18next';
import PageTitle from '../../components/PageTitle/v2';
import PageBreak from '../../components/PageBreak';
import PureSearchbarAndFilter from '../../components/PopupFilter/PureSearchbarAndFilter';
import CropStatusInfoBox from '../../components/CropCatalogue/CropStatusInfoBox';
import { AddLink } from '../../components/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { cropSelector } from '../cropSlice';
import {
  cropVarietiesWithoutManagementPlanByCropIdSelector,
  currentCropVarietiesByCropIdSelector,
  expiredCropVarietiesByCropIdSelector,
  plannedCropVarietiesByCropIdSelector,
} from '../fieldCropSlice';
import useCropTileListGap from '../../components/CropTile/useCropTileListGap';
import PureCropTile from '../../components/CropTile';
import PureCropTileContainer from '../../components/CropTile/CropTileContainer';
import { useEffect, useState } from 'react';
import { getCropVarieties } from '../saga';
import MuiFullPagePopup from '../../components/MuiFullPagePopup/v2';
import { cropCatalogueFilterDateSelector, setCropCatalogueFilterDate } from '../filterSlice';
import { isAdminSelector } from '../userFarmSlice';
import useStringFilteredCrops from '../CropCatalogue/useStringFilteredCrops';
import useSortByVarietyName from './useSortByVarietyName';
import { resetAndUnLockFormData } from '../hooks/useHookFormPersist/hookFormPersistSlice';

export default function CropVarieties({ history, match }) {
  const { t } = useTranslation();
  const isAdmin = useSelector(isAdminSelector);
  const dispatch = useDispatch();
  const crop_id = Number(match.params.crop_id);
  const crop = useSelector(cropSelector(crop_id));

  const [filterString, setFilterString] = useState('');
  const filterStringOnChange = (e) => setFilterString(e.target.value);

  const cropVarietiesWithoutManagementPlan = useStringFilteredCrops(
    useSortByVarietyName(useSelector(cropVarietiesWithoutManagementPlanByCropIdSelector(crop_id))),
    filterString,
  );
  const currentCropVarieties = useStringFilteredCrops(
    useSortByVarietyName(useSelector(currentCropVarietiesByCropIdSelector(crop_id))),
    filterString,
  );
  const plannedCropVarieties = useStringFilteredCrops(
    useSortByVarietyName(useSelector(plannedCropVarietiesByCropIdSelector(crop_id))),
    filterString,
  );
  const expiredCropVarieties = useStringFilteredCrops(
    useSortByVarietyName(useSelector(expiredCropVarietiesByCropIdSelector(crop_id))),
    filterString,
  );
  const { ref: containerRef, gap, padding, cardWidth } = useCropTileListGap([
    currentCropVarieties.length,
    plannedCropVarieties.length,
    expiredCropVarieties.length,
    cropVarietiesWithoutManagementPlan.length,
  ]);
  useEffect(() => {
    dispatch(getCropVarieties());
  }, []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const onFilterClose = () => {
    setIsFilterOpen(false);
  };
  const onFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const date = useSelector(cropCatalogueFilterDateSelector);
  const setDate = (date) => dispatch(setCropCatalogueFilterDate(date));

  const onGoBack = () => history.push('/crop_catalogue');

  const goToVarietyDetails = (varietyId) => {
    history.push(`/crop/${varietyId}/detail`);
  };

  const goToVarietyCreation = () => {
    history.push(`/crop/${crop_id}/add_crop_variety`);
  };

  useEffect(() => {
    dispatch(resetAndUnLockFormData());
  }, []);

  return (
    <Layout>
      <PageTitle
        title={`${t(`crop:${crop.crop_translation_key}`)} ${t('CROP_VARIETIES.CROP_VARIETIES')}`}
        style={{ paddingBottom: '20px' }}
        onGoBack={onGoBack}
      />
      <PureSearchbarAndFilter
        onFilterOpen={onFilterOpen}
        value={filterString}
        onChange={filterStringOnChange}
      />
      <MuiFullPagePopup open={isFilterOpen} onClose={onFilterClose}></MuiFullPagePopup>

      <CropStatusInfoBox style={{ marginBottom: '16px' }} date={date} setDate={setDate} />

      <div ref={containerRef}>
        {!!cropVarietiesWithoutManagementPlan.length && (
          <>
            <PageBreak style={{ paddingBottom: '22px' }} label={t('CROP_VARIETIES.NEEDS_PLAN')} />
            <PureCropTileContainer gap={gap} padding={padding}>
              {cropVarietiesWithoutManagementPlan.map((cropVariety) => {
                const {
                  crop_translation_key,
                  crop_variety_name,
                  crop_variety_id,
                  crop_variety_photo_url,
                } = cropVariety;
                const imageKey = crop_translation_key.toLowerCase();
                return (
                  <PureCropTile
                    key={cropVariety.crop_variety_id}
                    title={crop_variety_name || t(`crop:${crop_translation_key}`)}
                    src={crop_variety_photo_url}
                    alt={imageKey}
                    style={{ width: cardWidth }}
                    onClick={() => goToVarietyDetails(crop_variety_id)}
                  />
                );
              })}
            </PureCropTileContainer>
          </>
        )}

        {!!currentCropVarieties.length && (
          <>
            <PageBreak style={{ paddingBottom: '22px' }} label={t('common:ACTIVE')} />
            <PureCropTileContainer gap={gap} padding={padding}>
              {currentCropVarieties.map((cropVariety) => {
                const {
                  crop_translation_key,
                  crop_variety_name,
                  crop_variety_id,
                  crop_variety_photo_url,
                } = cropVariety;
                const imageKey = crop_translation_key.toLowerCase();
                return (
                  <PureCropTile
                    key={cropVariety.crop_variety_id}
                    title={crop_variety_name || t(`crop:${crop_translation_key}`)}
                    src={crop_variety_photo_url}
                    alt={imageKey}
                    style={{ width: cardWidth }}
                    onClick={() => goToVarietyDetails(crop_variety_id)}
                  />
                );
              })}
            </PureCropTileContainer>
          </>
        )}

        {!!plannedCropVarieties.length && (
          <>
            <PageBreak style={{ paddingBottom: '22px' }} label={t('common:PLANNED')} />
            <PureCropTileContainer gap={gap} padding={padding}>
              {plannedCropVarieties.map((cropVariety) => {
                const {
                  crop_translation_key,
                  crop_variety_name,
                  crop_variety_id,
                  crop_variety_photo_url,
                } = cropVariety;
                const imageKey = crop_translation_key.toLowerCase();
                return (
                  <PureCropTile
                    key={cropVariety.crop_variety_id}
                    title={crop_variety_name || t(`crop:${crop_translation_key}`)}
                    src={crop_variety_photo_url}
                    alt={imageKey}
                    style={{ width: cardWidth }}
                    onClick={() => goToVarietyDetails(crop_variety_id)}
                  />
                );
              })}
            </PureCropTileContainer>
          </>
        )}

        {!!expiredCropVarieties.length && (
          <>
            <PageBreak style={{ paddingBottom: '22px' }} label={t('common:PAST')} />
            <PureCropTileContainer gap={gap} padding={padding}>
              {expiredCropVarieties.map((cropVariety) => {
                const {
                  crop_translation_key,
                  crop_variety_name,
                  crop_variety_id,
                  crop_variety_photo_url,
                } = cropVariety;
                const imageKey = crop_translation_key.toLowerCase();
                return (
                  <PureCropTile
                    key={cropVariety.crop_variety_id}
                    title={crop_variety_name || t(`crop:${crop_translation_key}`)}
                    src={crop_variety_photo_url}
                    alt={imageKey}
                    style={{ width: cardWidth }}
                    onClick={() => goToVarietyDetails(crop_variety_id)}
                    isPastVariety
                  />
                );
              })}
            </PureCropTileContainer>
          </>
        )}
      </div>

      {isAdmin && (
        <AddLink onClick={goToVarietyCreation}>{t('CROP_VARIETIES.ADD_VARIETY')}</AddLink>
      )}
    </Layout>
  );
}
