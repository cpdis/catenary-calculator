/**
 * Default Component Dataset
 * 
 * This module provides default values for various mooring line components.
 * Values are based on common industry standards and typical configurations.
 * All values are in SI units:
 * - Sizes in millimeters (mm)
 * - Lengths in meters (m)
 * - Weights in kilograms per meter (kg/m)
 * - Stiffness (E) in Newtons per square meter (N/m²)
 * - MBL in Newtons (N)
 */

export const componentTypes = {
  CHAIN: 'Chain',
  WIRE: 'Wire Rope',
  SYNTHETIC: 'Synthetic Rope',
  POLYESTER: 'Polyester Rope'
};

export const componentCategories = {
  [componentTypes.CHAIN]: {
    description: 'Studless and Studlink Chain',
    sizes: ['76mm', '84mm', '92mm', '100mm', '111mm', '120mm', '132mm', '142mm', '162mm'],
    gradeOptions: ['R3', 'R3S', 'R4', 'R4S', 'R5']
  },
  [componentTypes.WIRE]: {
    description: 'Steel Wire Rope',
    sizes: ['52mm', '60mm', '70mm', '80mm', '90mm', '100mm', '110mm'],
    constructionOptions: ['6x19', '6x36', '6x41']
  },
  [componentTypes.SYNTHETIC]: {
    description: 'HMPE and Aramid Ropes',
    sizes: ['80mm', '90mm', '100mm', '120mm', '140mm', '160mm'],
    materialOptions: ['HMPE', 'Aramid']
  },
  [componentTypes.POLYESTER]: {
    description: 'Polyester Mooring Ropes',
    sizes: ['120mm', '140mm', '160mm', '180mm', '200mm'],
    constructionOptions: ['Parallel Strand', 'Braided']
  }
};

// Default component specifications based on type and size
export const componentDefaults = {
  // Studless Chain Defaults (R3 Grade)
  'Chain-76mm': {
    type: componentTypes.CHAIN,
    size: 76,
    weight: 113.5,
    stiffness: 5.9e10,
    mbl: 4370000,
    grade: 'R3',
    defaultLength: 300
  },
  'Chain-84mm': {
    type: componentTypes.CHAIN,
    size: 84,
    weight: 138.7,
    stiffness: 5.9e10,
    mbl: 5320000,
    grade: 'R3',
    defaultLength: 300
  },
  'Chain-92mm': {
    type: componentTypes.CHAIN,
    size: 92,
    weight: 166.2,
    stiffness: 5.9e10,
    mbl: 6380000,
    grade: 'R3',
    defaultLength: 300
  },

  // Wire Rope Defaults (6x36 Construction)
  'Wire-70mm': {
    type: componentTypes.WIRE,
    size: 70,
    weight: 21.5,
    stiffness: 1.0e11,
    mbl: 3180000,
    construction: '6x36',
    defaultLength: 500
  },
  'Wire-80mm': {
    type: componentTypes.WIRE,
    size: 80,
    weight: 28.1,
    stiffness: 1.0e11,
    mbl: 4150000,
    construction: '6x36',
    defaultLength: 500
  },
  'Wire-90mm': {
    type: componentTypes.WIRE,
    size: 90,
    weight: 35.6,
    stiffness: 1.0e11,
    mbl: 5250000,
    construction: '6x36',
    defaultLength: 500
  },

  // Synthetic Rope Defaults (HMPE)
  'Synthetic-100mm': {
    type: componentTypes.SYNTHETIC,
    size: 100,
    weight: 6.2,
    stiffness: 2.5e10,
    mbl: 4500000,
    material: 'HMPE',
    defaultLength: 800
  },
  'Synthetic-120mm': {
    type: componentTypes.SYNTHETIC,
    size: 120,
    weight: 8.9,
    stiffness: 2.5e10,
    mbl: 6480000,
    material: 'HMPE',
    defaultLength: 800
  },

  // Polyester Rope Defaults (Parallel Strand)
  'Polyester-140mm': {
    type: componentTypes.POLYESTER,
    size: 140,
    weight: 12.5,
    stiffness: 1.8e10,
    mbl: 4900000,
    construction: 'Parallel Strand',
    defaultLength: 1000
  },
  'Polyester-160mm': {
    type: componentTypes.POLYESTER,
    size: 160,
    weight: 16.3,
    stiffness: 1.8e10,
    mbl: 6400000,
    construction: 'Parallel Strand',
    defaultLength: 1000
  }
};

/**
 * Get default values for a specific component configuration
 * @param {string} type Component type
 * @param {string} size Component size (diameter in mm)
 * @returns {Object|null} Default values for the specified configuration
 */
export function getComponentDefaults(type, size) {
  const key = `${type}-${size}`;
  return componentDefaults[key] || null;
}

/**
 * Get available sizes for a component type
 * @param {string} type Component type
 * @returns {Array} Array of available sizes for the component type
 */
export function getAvailableSizes(type) {
  return componentCategories[type]?.sizes || [];
}

/**
 * Get available options for a component type (grade, construction, material)
 * @param {string} type Component type
 * @returns {Array} Array of available options for the component type
 */
export function getComponentOptions(type) {
  const category = componentCategories[type];
  if (!category) return [];
  
  if (type === componentTypes.CHAIN) return category.gradeOptions;
  if (type === componentTypes.WIRE) return category.constructionOptions;
  if (type === componentTypes.SYNTHETIC) return category.materialOptions;
  if (type === componentTypes.POLYESTER) return category.constructionOptions;
  
  return [];
}
