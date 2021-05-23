import React from 'react';
import WaterValve from '../../../../../components/LocationDetailLayout/PointDetails/WaterValve';
import decorator from '../../../config/decorators';

export default {
  title: 'Form/Location/Point/WaterValve',
  decorators: decorator,
  component: WaterValve,
};

const Template = (args) => <WaterValve {...args} />;

export const Post = Template.bind({});
Post.args = {
  isCreateLocationPage: true,
  useHookFormPersist: () => ({
    persistedData: { point: {}, type: 'type' },
  }),
  system: 'imperial',
};
Post.parameters = {
  chromatic: { viewports: [320, 414, 768, 1024, 1800] },
};
export const View = Template.bind({});
View.args = {
  isViewLocationPage: true,
  history: { location: { pathname: '/water_valve/location_id/details' } },
  match: { params: { location_id: 'location_id' } },
  submitForm: (data) => {},
  system: 'metric',
  isAdmin: true,
  useHookFormPersist: () => ({
    persistedData: { grid_points: {}, total_area: 1, perimeter: 2 },
  }),
};
View.parameters = {
  chromatic: { viewports: [320, 414, 768, 1024, 1800] },
};

export const Edit = Template.bind({});
Edit.args = {
  isEditLocationPage: true,
  submitForm: (data) => {},
  system: 'metric',
  isAdmin: true,
  useHookFormPersist: () => ({
    persistedData: { grid_points: {}, total_area: 1, perimeter: 2 },
  }),
};
Edit.parameters = {
  chromatic: { viewports: [320, 414, 768, 1024, 1800] },
};
