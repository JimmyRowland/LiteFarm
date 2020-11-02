/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (index.js) is part of LiteFarm.
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

import convert from 'convert-units';
import commonCurrency from '../containers/AddFarm/currency/commonCurrency.json';
import { getMeasurementFromStore, getCurrencyFromStore } from './getFromReduxStore';

const METRIC = 'metric';
// const IMPERIAL = 'IMPERIAL';

// returns the current root URI of litefarm
export const getCurrentRootURI = () => {
  const splitURI = window.location.href.split('/');
  return splitURI[0] + '//' + splitURI[2]
}
// returns a unit of measurement based on farm config
export const getUnit = (farm, metricUnit, imperialUnit) => {
  return farm && farm.units && farm.units.measurement === 'metric' ? metricUnit : imperialUnit;
};

// converts current value to metric unit as stored in db ie. quantity_kg values should always be converted to kg
export const convertToMetric = (value, currentUnit, metricUnit, inverse) => {
  if (inverse) {
    const inverted = 1 / value;
    return 1 / (convert(inverted).from(currentUnit).to(metricUnit));
  }
  return convert(value).from(currentUnit).to(metricUnit);
};

// converts current value FROM metric unit as stored in db ie. quantity_kg values should always be converted from kg
export const convertFromMetric = (value, currentUnit, metricUnit, inverse) => {
  if (inverse) {
    const inverted = 1 / value;
    return 1 / (convert(inverted).from(metricUnit).to(currentUnit));
  }
  return convert(value).from(metricUnit).to(currentUnit);
};

export const roundToFourDecimal = (value) => {
  return Math.round(value * 10000) / 10000;
};

export const roundToTwoDecimal = (value) => {
  return Math.round(value * 100) / 100
};

export function grabCurrencySymbol(currency = getCurrencyFromStore()) {
  if (currency && (currency in commonCurrency)) {
    return commonCurrency[currency]['symbol_native'];
  } else {
    return '$'
  }
}

const getConvertedString = (value, measurement, convertUnitMetric, convertUnitImperial, metricSymbol, imperialSymbol) => {
  return measurement === METRIC ? `${value} ${metricSymbol ? metricSymbol : convertUnitMetric}` :
    `${Math.round(convert(value).from(convertUnitMetric).to(convertUnitImperial))} ${imperialSymbol ? imperialSymbol : convertUnitImperial}`;
}

export const getFormatedTemperature = (temperature, measurement = getMeasurementFromStore()) => {
  return getConvertedString(temperature,measurement,'C','F', 'ºC', '°F');
}

export const getDistance = (distance, measurement = getMeasurementFromStore()) => {
  return getConvertedString(distance, measurement, 'km', 'mi');
}
