import React from 'react';

interface SuggestionBoxProps {
  promptText: string;
  onGenerateSuggestions: () => void;
  suggestions: string[];
  addedSuggestions: string[];
  isSuggesting: boolean;
  onAddSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ 
  promptText, 
  onGenerateSuggestions, 
  suggestions, 
  addedSuggestions,
  isSuggesting,
  onAddSuggestion,
  disabled
}) => {

  const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 6.343l-2.828 2.828M17.657 17.657l2.828 2.828M18 5h4M19 3v4M17.657 6.343l2.828-2.828M6.343 17.657l-2.828-2.828M12 21v-4M21 12h-4M4 12H0M12 4V0" />
    </svg>
  );

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-slate-200 p-6 rounded-xl shadow-lg mt-6">
      <h3 className="text-xl font-semibold mb-4 text-slate-800">✨ پیشنهاد هوش مصنوعی</h3>
      <p className="text-slate-500 mb-4">
        با کلیک روی دکمه زیر، جزئیات خلاقانه‌ای برای بهتر شدن پرامپت خود دریافت کنید.
      </p>
      <button
        onClick={onGenerateSuggestions}
        disabled={!promptText || isSuggesting || disabled}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-white
          ${(!promptText || disabled)
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90'
          }
        `}
      >
        <SparkleIcon />
        {isSuggesting ? 'در حال دریافت پیشنهاد...' : 'دریافت پیشنهاد'}
      </button>

      {(suggestions.length > 0 || isSuggesting) && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <h4 className="text-lg font-medium text-slate-600 mb-3">پیشنهادها:</h4>
          {isSuggesting ? (
             <div className="flex flex-wrap gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-4 py-2 rounded-full bg-slate-200 h-9 w-32 animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="flex flex-wrap gap-3">
            {suggestions.map((suggestion, index) => {
              const isAdded = addedSuggestions.includes(suggestion);
              return (
              <button
                key={index}
                onClick={() => onAddSuggestion(suggestion)}
                disabled={isAdded}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105
                  ${isAdded 
                      ? 'bg-green-100 text-green-800 cursor-default ring-1 ring-green-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }
                `}
                title={isAdded ? 'این مورد به پرامپت اضافه شده است' : `افزودن "${suggestion}" به پرامپت`}
              >
                {isAdded ? '✓' : '+'} {suggestion}
              </button>
            )})}
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;