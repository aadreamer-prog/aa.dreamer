export interface Option {
  label: string;
  value: string;
  description?: string;
  previewImageUrl?: string;
}

// New type for sub-categories within a multi-select section
export interface SubCategory {
  title: string;
  options: Option[];
  selectionType: 'single' | 'multiple';
}

// The original, simple category structure
export interface SimpleCategory {
  id: string;
  title: string;
  type: 'simple';
  options: Option[];
}

// New structure for complex, grouped multi-select categories like Camera Angle
export interface MultiSelectCategory {
  id:string;
  title: string;
  type: 'multi-select-grouped';
  subCategories: SubCategory[];
}

// Type for a color option that includes a hex value for display
export interface ColorOption extends Option {
  hex: string;
}

// New type for a group of colors
export interface ColorGroup {
  title: string;
  options: ColorOption[];
}

// Type for the new interactive color grid category
export interface ColorGridCategory {
  id: string;
  title: string;
  type: 'color-grid';
  groups: ColorGroup[];
}


// A union type that can represent any kind of category in the app
export type Category = SimpleCategory | MultiSelectCategory | ColorGridCategory;