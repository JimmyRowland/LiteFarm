import React from 'react';
import { useTranslation } from 'react-i18next';
import LineDetailsLayout from '..';
import { useForm } from 'react-hook-form';
import Radio from '../../Form/Radio';
import { Label } from '../../Typography';
import { line_length, line_width, watercourse_width } from '../../../util/unit';
import Unit from '../../Form/Unit';
import { watercourseEnum } from '../../../containers/constants';

export default function PureWatercourse({ history, submitForm, system, useHookFormPersist }) {
  const { t } = useTranslation();
  const unit = system === 'metric' ? 'm' : 'ft';
  const {
    register,
    handleSubmit,
    watch,
    errors,
    setValue,
    getValues,
    setError,
    control,
    formState: { isValid, isDirty },
  } = useForm({
    mode: 'onChange',
  });
  const {
    persistedData: {
      line_points,
      length,
      width,

      buffer_width,
    },
  } = useHookFormPersist(['/map'], getValues, setValue);
  const onError = (data) => {};
  const usedForIrrigation = watch(watercourseEnum.used_for_irrigation);
  const disabled = !isValid || !isDirty;
  const onSubmit = (data) => {
    data[watercourseEnum.length_unit] = data[watercourseEnum.length_unit].value;
    const formData = {
      line_points,
      length,
      width,
      buffer_width,
      ...data,
      type: 'watercourse',
      used_for_irrigation: usedForIrrigation !== null ? usedForIrrigation === 'true' : null,
    };
    formData[watercourseEnum.length_unit] = formData[watercourseEnum.length_unit].value;
    formData[watercourseEnum.width_unit] = formData[watercourseEnum.width_unit].value;
    formData[watercourseEnum.buffer_width_unit] = formData[watercourseEnum.buffer_width_unit].value;
    submitForm({ formData });
  };

  return (
    <LineDetailsLayout
      name={t('FARM_MAP.WATERCOURSE.NAME')}
      title={t('FARM_MAP.WATERCOURSE.TITLE')}
      history={history}
      submitForm={onSubmit}
      onError={onError}
      register={register}
      disabled={disabled}
      handleSubmit={handleSubmit}
      setValue={setValue}
      getValues={getValues}
      setError={setError}
      control={control}
      errors={errors}
      system={system}
    >
      <div>
        <div>
          <Unit
            style={{ marginBottom: '40px', zIndex: 2 }}
            register={register}
            classes={{ container: { flexGrow: 1 } }}
            label={t('FARM_MAP.WATERCOURSE.LENGTH')}
            name={watercourseEnum.length}
            displayUnitName={watercourseEnum.length_unit}
            defaultValue={length}
            errors={errors[watercourseEnum.length]}
            unitType={line_length}
            system={system}
            hookFormSetValue={setValue}
            hookFormGetValue={getValues}
            hookFormSetError={setError}
            hookFromWatch={watch}
            control={control}
            required
          />
        </div>
        <div>
          <Unit
            register={register}
            classes={{ container: { flexGrow: 1, marginBottom: '40px' } }}
            label={t('FARM_MAP.WATERCOURSE.WIDTH')}
            name={watercourseEnum.width}
            displayUnitName={watercourseEnum.width_unit}
            errors={errors[watercourseEnum.width]}
            unitType={line_width}
            system={system}
            hookFormSetValue={setValue}
            hookFormGetValue={getValues}
            hookFormSetError={setError}
            hookFromWatch={watch}
            control={control}
            disabled
            defaultValue={width}
          />
        </div>
        <div>
          <Unit
            register={register}
            classes={{ container: { flexGrow: 1, marginBottom: '40px' } }}
            label={t('FARM_MAP.WATERCOURSE.BUFFER')}
            name={watercourseEnum.buffer_width}
            displayUnitName={watercourseEnum.buffer_width_unit}
            errors={errors[watercourseEnum.buffer_width]}
            unitType={watercourse_width}
            system={system}
            hookFormSetValue={setValue}
            hookFormGetValue={getValues}
            hookFormSetError={setError}
            hookFromWatch={watch}
            control={control}
            disabled
            defaultValue={buffer_width}
          />
        </div>
        <div>
          <p style={{ marginBottom: '25px' }}>
            {t('FARM_MAP.WATERCOURSE.IRRIGATION')}
            <Label style={{ paddingLeft: '10px' }} sm>
              ({t('common:OPTIONAL')})
            </Label>
          </p>
          <div>
            <Radio
              style={{ marginBottom: '25px' }}
              label={t('common:YES')}
              inputRef={register({ required: false })}
              value={true}
              name={watercourseEnum.used_for_irrigation}
            />
          </div>
          <div>
            <Radio
              style={{ marginBottom: '25px' }}
              label={t('common:NO')}
              inputRef={register({ required: false })}
              value={false}
              name={watercourseEnum.used_for_irrigation}
            />
          </div>
        </div>
      </div>
    </LineDetailsLayout>
  );
}