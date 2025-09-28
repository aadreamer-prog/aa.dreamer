import React, { useState } from 'react';
import type { ColorGroup } from '../types';

interface ColorGridSectionProps {
  title: string;
  groups: ColorGroup[];
  selectedValues: string[];
  onSelect: (value: string) => void;
}

const ColorGridSection: React.FC<ColorGridSectionProps> = ({ title, groups, selectedValues, onSelect }) => {
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
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <ChevronIcon open={isOpen} />
      </button>

      <div 
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6">
          <p className="text-slate-500 mb-6">
            روی رنگ‌های مورد نظر خود کلیک کنید. (برای دیدن نام فارسی رنگ، ماوس را روی آن نگه دارید)
          </p>
          <div className="grid grid-cols-4 gap-x-2 gap-y-8 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col items-center gap-y-3">
                <h4 className="text-md font-semibold text-slate-600 pb-2 border-b-2 border-slate-200 w-full text-center h-14 flex items-center justify-center break-words">
                  {group.title}
                </h4>
                <div className="flex flex-col items-center gap-2">
                  {group.options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <button
                            key={option.value}
                            onClick={() => onSelect(option.value)}
                            title={option.description || option.label}
                            aria-label={option.label}
                            className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center text-center transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-fuchsia-500
                            ${isSelected ? 'border-fuchsia-500 ring-2 ring-fuchsia-500' : 'border-slate-300'}
                            `}
                            style={{ background: option.hex }}
                        >
                            <span className="text-[9px] font-bold text-white mix-blend-difference leading-tight select-none pointer-events-none p-1">
                                {option.label}
                            </span>
                            {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-5 w-5 text-white mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            )}
                        </button>
                      )
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

export default ColorGridSection;