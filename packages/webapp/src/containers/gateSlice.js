import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { figureProperties, locationProperties, pointProperties } from './constants';
import { loginSelector, onLoadingFail, onLoadingStart, onLoadingSuccess } from './userFarmSlice';
import { createSelector } from 'reselect';
import { pick } from '../util';

const gateProperties = ['location_id'];
export const getLocationObjectFromGate = (data) => {
  return {
    figure: {
      ...pick(data, figureProperties),
      point: pick(data, pointProperties),
    },
    gate: pick(data, gateProperties),
    ...pick(data, locationProperties),
  };
};
const getGateFromLocationObject = (location) => {
  return {
    ...pick(location, locationProperties),
    ...pick(location.figure, figureProperties),
    ...pick(location.figure.point, pointProperties),
    ...pick(location.gate, gateProperties),
  };
};

const upsertOneGateWithLocation = (state, { payload: location }) => {
  gateAdapter.upsertOne(state, getGateFromLocationObject(location));
};
const upsertManyGateWithLocation = (state, { payload: locations }) => {
  gateAdapter.upsertMany(
    state,
    locations.map((location) => getGateFromLocationObject(location)),
  );
  onLoadingSuccess(state);
};

const gateAdapter = createEntityAdapter({
  selectId: (gate) => gate.location_id,
});

const gateSlice = createSlice({
  name: 'gateReducer',
  initialState: gateAdapter.getInitialState({
    loading: false,
    error: undefined,
    location_id: undefined,
    loaded: false,
  }),
  reducers: {
    onLoadingGateStart: onLoadingStart,
    onLoadingGateFail: onLoadingFail,
    getGatesSuccess: upsertManyGateWithLocation,
    postGateSuccess: upsertOneGateWithLocation,
    editGateSuccess: upsertOneGateWithLocation,
    deleteGateSuccess: gateAdapter.removeOne,
  },
});
export const {
  getGatesSuccess,
  postGateSuccess,
  editGateSuccess,
  onLoadingGateStart,
  onLoadingGateFail,
  deleteGateSuccess,
} = gateSlice.actions;
export default gateSlice.reducer;

export const gateReducerSelector = (state) => state.entitiesReducer[gateSlice.name];

const gateSelectors = gateAdapter.getSelectors((state) => state.entitiesReducer[gateSlice.name]);

export const gateEntitiesSelector = gateSelectors.selectEntities;
export const gatesSelector = createSelector(
  [gateSelectors.selectAll, loginSelector],
  (gates, { farm_id }) => {
    return gates.filter((gate) => gate.farm_id === farm_id);
  },
);

export const gateSelector = (location_id) =>
  createSelector(gateEntitiesSelector, (entities) => entities[location_id]);

export const gateStatusSelector = createSelector(
  [gateReducerSelector],
  ({ loading, error, loaded }) => {
    return { loading, error, loaded };
  },
);
