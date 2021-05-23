import React from 'react';
import PureHarvestUseType from '../../../components/Logs/HarvestUseType';
import {
  canEditSelector,
  canEditStepTwo,
  canEditStepTwoSelector,
  harvestLogData,
  harvestLogDataSelector,
} from '../Utility/logSlice';
import { useDispatch, useSelector } from 'react-redux';
import history from '../../../history';
import { userFarmSelector } from '../../userFarmSlice';
import { currentLogSelector, setAllHarvestUseTypesSelector } from '../selectors';
import { toastr } from 'react-redux-toastr';
import { useTranslation } from 'react-i18next';

function HarvestUseType() {
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'message']);
  const allUseType = useSelector(setAllHarvestUseTypesSelector);
  const defaultData = useSelector(harvestLogDataSelector);
  const farm = useSelector(userFarmSelector);
  const isEditStepTwo = useSelector(canEditStepTwoSelector);
  const selectedLog = useSelector(currentLogSelector);
  const isEdit = useSelector(canEditSelector);
  const onBack = (data) => {
    dispatch(canEditStepTwo(false));
    const tempProps = JSON.parse(JSON.stringify(data));
    let newData;
    if (defaultData.selectedUseTypes.length > 0) {
      const defaultQuantities = defaultData.selectedUseTypes.reduce((obj, item) => {
        let name = isEditStepTwo.isEditStepTwo
          ? item.harvestUseType.harvest_use_type_name
          : item.harvest_use_type_name;
        return { ...obj, [name]: item.quantity_kg };
      }, {});
      newData = tempProps.selectedUseTypes.map((item) => ({
        ...item,
        quantity_kg: defaultQuantities[item.harvest_use_type_name]
          ? defaultQuantities[item.harvest_use_type_name]
          : item.quantity_kg,
      }));
    }
    dispatch(
      harvestLogData({
        ...defaultData,
        selectedUseTypes: !newData ? tempProps.selectedUseTypes : newData,
      }),
    );
    history.push('/harvest_log');
  };

  const onNext = (data) => {
    if (isEditStepTwo.isEditStepTwo) {
      const defaultQuantities = defaultData.selectedUseTypes.reduce((obj, item) => {
        return { ...obj, [item.harvest_use_type_id]: item.quantity_kg };
      }, {});
      const newData = data.selectedUseTypes.map((item) => ({
        ...item,
        quantity_kg: defaultQuantities[item.harvest_use_type_id],
      }));
      dispatch(canEditStepTwo(false));
      dispatch(harvestLogData({ ...defaultData, selectedUseTypes: newData }));
    } else {
      const tempProps = JSON.parse(JSON.stringify(data));
      if (defaultData.selectedUseTypes.length > 0) {
        const defaultQuantities = defaultData.selectedUseTypes.reduce((obj, item) => {
          let name = item.harvest_use_type_name
            ? item.harvest_use_type_name
            : item.harvestUseType.harvest_use_type_name;
          return { ...obj, [name]: item.quantity_kg };
        }, {});
        const newData = tempProps.selectedUseTypes.map((item) => ({
          ...item,
          quantity_kg: defaultQuantities[item.harvest_use_type_name]
            ? defaultQuantities[item.harvest_use_type_name]
            : item.quantity_kg,
        }));
        dispatch(
          harvestLogData({
            ...defaultData,
            selectedUseTypes: newData,
          }),
        );
      } else {
        dispatch(
          harvestLogData({
            ...defaultData,
            selectedUseTypes: tempProps.selectedUseTypes,
          }),
        );
      }
    }
    history.push('/harvest_allocation');
  };

  const showUseTypeRequiredError = () => toastr.error(t('message:LOG_HARVEST.ERROR.REQUIRED_TASK'));

  return (
    <>
      <PureHarvestUseType
        onGoBack={onBack}
        onNext={onNext}
        useTypes={allUseType}
        defaultData={defaultData}
        farm={farm}
        showUseTypeRequiredError={showUseTypeRequiredError}
        isEdit={isEdit}
        selectedLog={selectedLog}
        history={history}
      />
    </>
  );
}

export default HarvestUseType;
