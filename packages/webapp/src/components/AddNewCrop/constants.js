// constants for crop groups and subgroups
const CROP_GROUPS = [
  'Fruit and nuts',
  'Beverage and spice crops',
  'Potatoes and yams',
  'Vegetables and melons',
  'Cereals',
  'Leguminous crops',
  'Sugar crops',
  'Oilseed crops',
  'Other crops',
];
CROP_GROUPS.sort();

const CROP_SUBGROUPS = [
  'Fibre crops',
  'Grasses and other fodder crops',
  'Nuts',
  'Temporary spice crops',
  'Pome fruits and stone fruits',
  'High starch Root/tuber crops',
  'Leafy or stem vegetables',
  'Tropical and subtropical fruits',
  'Cereals',
  'Legumes',
  'Sugar crops (root)',
  'Citrus fruits',
  'Permanent spice crops',
  'Berries',
  'Fruit-bearing vegetables',
  'Other fruits',
  'Root, bulb, or tuberous vegetables',
  'Temporary oilseed crops',
  'Permanent oilseed crops',
  'Medicinal, aromatic, pesticidal, or similar crops',
  'Grapes',
  'Flower crops',
  'Mushrooms and truffles',
  'Rubber',
  'Sugar crops (other)',
  'Tobacco',
  'Other crops',
];
CROP_SUBGROUPS.sort();

export const CROP_DICT = {
  'Fruit and nuts': [
    'Nuts',
    'Pome fruits and stone fruits',
    'Tropical and subtropical fruits',
    'Citrus fruits',
    'Berries',
    'Grapes',
    'Other fruits',
    'Mushrooms and truffles',
  ],
  'Beverage and spice crops': ['Temporary spice crops', 'Permanent spice crops'],
  'Potatoes and yams': [],
  'Vegetables and melons': [
    'High starch Root/tuber crops',
    'Leafy or stem vegetables',
    'Fruit-bearing vegetables',
    'Root, bulb, or tuberous vegetables',
  ],
  Cereals: ['Cereals'],
  'Leguminous crops': ['Legumes'],
  'Sugar crops': ['Sugar crops (root)', 'Sugar crops (other)'],
  'Oilseed crops': ['Temporary oilseed crops', 'Permanent oilseed crops'],
  'Other crops': [
    'Other crops',
    'Fibre crops',
    'Grasses and other fodder crops',
    'Medicinal, aromatic, pesticidal, or similar crops',
    'Flower crops',
    'Rubber',
    'Tobacco',
  ],
};

const BEVERAGE_AND_SPICE_CROPS = 'Beverage and spice crops';
const CEREALS = 'Cereals';
const FRUITS_AND_NUTS = 'Fruit and nuts';
const LEGUMINOUS_CROPS = 'Leguminous crops';
const OILSEED_CROPS = 'Oilseed crops';
const OTHER_CROPS = 'Other crops';
const POTATOES_AND_YAMS = 'Potatoes and yams';
const SUGAR_CROPS = 'Sugar crops';
const VEGETABLE_AND_MELONS = 'Vegetables and melons';

const NUTRIENT_DICT = {
  initial_kc: 'INIT_KC',
  mid_kc: 'MID_KC',
  end_kc: 'END_KC',
  max_height: 'MAX_HEIGHT',
  protein: 'PROTEIN',
  lipid: 'LIPID',
  energy: 'ENERGY',
  ca: 'CALCIUM',
  fe: 'IRON',
  mg: 'MAGNESIUM',
  ph: 'PH',
  k: 'K',
  na: 'NA',
  zn: 'ZINC',
  cu: 'COPPER',
  mn: 'MANGANESE',
  vita_rae: 'VITA_RAE',
  vitc: 'VITAMIN_C',
  thiamin: 'THIAMIN',
  riboflavin: 'RIBOFLAVIN',
  niacin: 'NIACIN',
  vitb6: 'VITAMIN_B6',
  folate: 'FOLATE',
  vitb12: 'VITAMIN_B12',
  max_rooting_depth: 'MAX_ROOTING',
  nutrient_credits: 'NUTRIENT_CREDITS',
};

const FIRST_NUTRIENT_ARRAY = ['initial_kc', 'mid_kc', 'end_kc', 'max_height', 'max_rooting_depth'];

const SECOND_NUTRIENT_ARRAY = [
  'protein',
  'lipid',
  'ph',
  'energy',
  'ca',
  'fe',
  'mg',
  'k',
  'na',
  'zn',
  'cu',
  'mn',
  'vita_rae',
  'vitc',
  'thiamin',
  'riboflavin',
  'niacin',
  'vitb6',
  'folate',
  'vitb12',
  'nutrient_credits',
];

const NUTRIENT_ARRAY = FIRST_NUTRIENT_ARRAY.concat(SECOND_NUTRIENT_ARRAY);

export {
  CROP_GROUPS,
  CROP_SUBGROUPS,
  NUTRIENT_DICT,
  FIRST_NUTRIENT_ARRAY,
  SECOND_NUTRIENT_ARRAY,
  NUTRIENT_ARRAY,
  BEVERAGE_AND_SPICE_CROPS,
  CEREALS,
  FRUITS_AND_NUTS,
  LEGUMINOUS_CROPS,
  OILSEED_CROPS,
  OTHER_CROPS,
  POTATOES_AND_YAMS,
  SUGAR_CROPS,
  VEGETABLE_AND_MELONS,
};
