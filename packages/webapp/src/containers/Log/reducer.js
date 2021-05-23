/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (reducer.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import {
  RESET_LOG_FILTER,
  SAVE_HARVEST_ALLOCATION_WIP,
  SET_ALL_HARVEST_USE_TYPES,
  SET_DEFAULT_DATE,
  SET_DEFAULT_DATE_RANGE,
  SET_END_DATE,
  SET_FORM_DATA,
  SET_FORM_VALUE,
  SET_LOG_CROP_FILTER,
  SET_LOG_FIELD_FILTER,
  SET_LOG_TYPE,
  SET_LOGS_IN_STATE,
  SET_SELECTED_LOG,
  SET_SELECTED_USE_TYPES,
  SET_START_DATE,
} from './constants';
import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import fertReducer from './FertilizingLog/reducer';
import pestControlReducer from './PestControlLog/reducer';
import moment from 'moment';

const initialState = {
  logs: null,
  startDate: moment().startOf('year'),
  endDate: moment().endOf('year'),
  cropFilter: undefined,
  fieldFilter: undefined,
  logType: undefined,
  allUseType: [],
};

function logReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGS_IN_STATE:
      return Object.assign({}, state, {
        logs: action.logs,
      });
    case SET_SELECTED_LOG:
      return Object.assign({}, state, {
        selectedLog: action.log,
      });
    case SET_FORM_DATA:
      return Object.assign({}, state, {
        formData: action.formData,
      });
    case SET_SELECTED_USE_TYPES:
      return Object.assign({}, state, {
        useType: action.useType,
      });
    case SET_ALL_HARVEST_USE_TYPES:
      return Object.assign({}, state, {
        allUseType: action.allUseType,
      });
    case SET_FORM_VALUE:
      return Object.assign({}, state, {
        formValue: action.formValue,
      });
    case SET_START_DATE:
      return Object.assign({}, state, {
        startDate: action.startDate,
      });
    case SET_END_DATE:
      return Object.assign({}, state, {
        endDate: action.endDate,
      });
    case SET_DEFAULT_DATE_RANGE:
      return Object.assign({}, state, {
        startDate: moment().startOf('year'),
        endDate: moment().endOf('year'),
      });
    case SET_DEFAULT_DATE:
      return Object.assign({}, state, {
        defaultDate: action.defaultDate,
      });
    case SAVE_HARVEST_ALLOCATION_WIP:
      return Object.assign({}, state, {
        harvestAllocation: action.harvestAllocation,
      });
    case SET_LOG_CROP_FILTER:
      return Object.assign({}, state, {
        cropFilter: action.cropFilter,
      });
    case SET_LOG_FIELD_FILTER:
      return Object.assign({}, state, {
        fieldFilter: action.fieldFilter,
      });
    case SET_LOG_TYPE:
      return Object.assign({}, state, {
        logType: action.logType,
      });
    case RESET_LOG_FILTER:
      return Object.assign({}, state, {
        logType: initialState.logType,
        fieldFilter: initialState.fieldFilter,
        cropFilter: initialState.cropFilter,
        startDate: moment().startOf('year'),
        endDate: moment().endOf('year'),
      });
    default:
      return state;
  }
}

const fertLog = {
  fert_id: null,
  quantity_kg: 0,
  notes: '',
  moisture_percentage: 0,
  n_percentage: 0,
  nh4_n_ppm: 0,
  p_percentage: 0,
  k_percentage: 0,
  field: null,
};

const irrigationLog = {
  activity_kind: 'irrigation',
  type: '',
  notes: '',
  flow_rate: null,
  unit: 'l/min',
  hours: null,
  field: null,
};

const scoutingLog = {
  activity_kind: 'scouting',
  type: '',
  notes: '',
  action_needed: false,
  field: null,
};

const fieldWorkLog = {
  type: null,
  notes: '',
  field: null,
};

const seedLog = {
  space_length: null,
  space_width: null,
  space_unit: null,
  rate: null,
  rate_unit: null,
  field: null,
};

const otherLog = {
  notes: '',
  field: null,
};

const harvestLog = {
  notes: '',
  field: null,
};

const harvestAllocation = {};

const pcLog = {
  quantity: 0,
  notes: '',
  custom_pesticide_name: '',
  custom_disease_scientific_name: '',
  custom_disease_common_name: '',
  custom_disease_group: 'Other',
  crop: null,
  pesticide_id: null,
  disease_id: 1,
  type: '',
  entry_interval: 0,
  harvest_interval: 0,
  active_ingredients: '',
  concentration: 0,
  field: null,
};

export default combineReducers({
  forms: combineForms(
    {
      fertLog: fertLog,
      fieldWorkLog: fieldWorkLog,
      harvestLog: harvestLog,
      irrigationLog: irrigationLog,
      otherLog: otherLog,
      pestControlLog: pcLog,
      scoutingLog: scoutingLog,
      seedLog: seedLog,
      soilDataLog: {},
      harvestAllocation: harvestAllocation,
    },
    'logReducer.forms',
  ),
  logReducer,
  fertReducer,
  pestControlReducer,
});
