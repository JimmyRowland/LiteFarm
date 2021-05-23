/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (cropModel.js) is part of LiteFarm.
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

const Model = require('objection').Model;
const BaseModel = require('./baseModel');

class CropVariety extends BaseModel {
  static get tableName() {
    return 'crop_variety';
  }

  static get idColumn() {
    return 'crop_variety_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['crop_id', 'farm_id', 'crop_variety_name'],
      properties: {
        crop_variety_id: { type: 'string' },
        crop_id: { type: 'integer' },
        farm_id: { type: 'string' },
        crop_variety_name: { type: ['string', null] },
        supplier: { type: ['string', null] },
        seeding_type: { type: 'string', enum: ['SEED', 'SEEDLING_OR_PLANTING_STOCK'] },
        lifecycle: { type: 'string', enum: ['ANNUAL', 'PERENNIAL'] },
        compliance_file_url: { type: ['string', null] },
        organic: { type: ['boolean', null] },
        treated: { type: ['boolean', null] },
        genetically_engineered: { type: ['boolean', null] },
        searched: { type: ['boolean', null] },
        protein: { type: ['number', null] },
        lipid: { type: ['number', null] },
        ph: { type: ['number', null] },
        energy: { type: ['number', null] },
        ca: { type: ['number', null] },
        fe: { type: ['number', null] },
        mg: { type: ['number', null] },
        k: { type: ['number', null] },
        na: { type: ['number', null] },
        zn: { type: ['number', null] },
        cu: { type: ['number', null] },
        mn: { type: ['number', null] },
        vita_rae: { type: ['number', null] },
        vitc: { type: ['number', null] },
        thiamin: { type: ['number', null] },
        riboflavin: { type: ['number', null] },
        niacin: { type: ['number', null] },
        vitb6: { type: ['number', null] },
        folate: { type: ['number', null] },
        vitb12: { type: ['number', null] },
        nutrient_credits: { type: ['number', null] },
        crop_variety_photo_url: { type: 'string' },
        ...this.baseProperties,
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    return {
      crop: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./cropModel'),
        join: {
          from: 'crop_variety.crop_id',
          to: 'crop.crop_id',
        },
      },
    };
  }
}

module.exports = CropVariety;
