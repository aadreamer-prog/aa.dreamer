import React, { useState, useEffect } from 'react';
import type { Option } from '../types';

interface PromptSectionProps {
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  initialOpen?: boolean;
}

const PromptSection: React.FC<PromptSectionProps> = ({ title, options, selectedValue, onSelect, disabled, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [preview, setPreview] = useState<{ src: string; top: number; left: number; description: string } | null>(null);

  // When a section becomes enabled, open it. If it becomes disabled, close it.
  useEffect(() => {
    if (disabled === false) {
      setIsOpen(true);
    } else if (disabled === true) {
      setIsOpen(false);
    }
  }, [disabled]);


  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, option: Option) => {
    if (!option.previewImageUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPreview({
      src: option.previewImageUrl,
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      description: option.description || option.label,
    });
  };

  const handleMouseLeave = () => {
    setPreview(null);
  };

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
    <>
      {preview && (
        <div
          className="fixed z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-2xl pointer-events-none transition-all duration-200 ease-in-out animate-fade-in"
          style={{ top: `${preview.top}px`, left: `${preview.left}px`, maxWidth: '200px' }}
        >
          <img src={preview.src} className="w-48 h-48 object-cover rounded-md mb-2" alt={preview.description} />
          <p className="text-xs text-center text-slate-600">{preview.description}</p>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fade-in 0.2s ease-in-out;
            }
          `}</style>
        </div>
      )}
      <div className="relative bg-white/70 backdrop-blur-lg border border-slate-200 rounded-xl shadow-lg mb-6 overflow-hidden transition-all duration-300">
        {disabled && (
          <div 
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center cursor-not-allowed"
            aria-hidden="true"
          >
            <p className="text-slate-600 text-center font-semibold p-4">
              برای فعال‌سازی این بخش، ابتدا یک سوژه انسانی وارد کنید.
            </p>
          </div>
        )}
         <button 
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
            aria-expanded={isOpen}
            disabled={disabled}
        >
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <ChevronIcon open={isOpen} />
        </button>
        <div 
          className={`transition-all duration-500 ease-in-out ${disabled ? 'opacity-40' : ''} ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          aria-disabled={disabled}
        >
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    onMouseEnter={(e) => handleMouseEnter(e, option)}
                    onMouseLeave={handleMouseLeave}
                    title={option.description}
                    disabled={disabled}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105
                    ${
                        selectedValue === option.value
                        ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md ring-2 ring-pink-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                    ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                >
                    {option.label}
                </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromptSection;