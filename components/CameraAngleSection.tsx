import React, { useState } from 'react';
import type { MultiSelectCategory } from '../types';

interface CameraAngleSectionProps {
  category: MultiSelectCategory;
  selectedValues: string[];
  onSelect: (subCategoryTitle: string, value: string, selectionType: 'single' | 'multiple') => void;
}

const CameraAngleSection: React.FC<CameraAngleSectionProps> = ({ category, selectedValues, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-6 w-6 transform text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-xl shadow-lg mb-6 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-semibold text-slate-800">{category.title}</h3>
        <ChevronIcon open={isOpen} />
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6">
          <div className="space-y-6">
            {category.subCategories.map((subCategory) => (
              <div key={subCategory.title}>
                <h4 className="text-md font-semibold text-slate-500 mb-3 border-b border-slate-200 pb-2">{subCategory.title}</h4>
                <div className="flex flex-wrap gap-3">
                  {subCategory.options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => onSelect(subCategory.title, option.value, subCategory.selectionType)}
                        title={option.description}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105
                          ${
                            isSelected
                              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md ring-2 ring-pink-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraAngleSection;