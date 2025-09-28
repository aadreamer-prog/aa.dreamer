import React, { useState } from 'react';

interface FinalPromptProps {
  promptText: string;
  onClearAll: () => void;
}

const FinalPrompt: React.FC<FinalPromptProps> = ({ promptText, onClearAll }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopyStatus('copied');
    setTimeout(() => {
      setCopyStatus('idle');
    }, 2000);
  };
  
  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const CheckIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
  
    const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );


  return (
    <div className="bg-white/70 backdrop-blur-lg border border-slate-200 p-6 rounded-xl shadow-lg mb-6">
      <h3 className="text-2xl font-semibold mb-4 text-slate-800">پرامپت نهایی شما</h3>
      <div dir="ltr" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 min-h-[120px] text-gray-200 text-left font-mono text-lg leading-relaxed select-all">
        {promptText || <span className="text-gray-500">پرامپت شما اینجا نمایش داده می‌شود...</span>}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopy}
          disabled={!promptText}
          className={`w-full sm:w-auto flex-grow flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200
            ${!promptText 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : copyStatus === 'copied'
                ? 'bg-green-600 text-white'
                : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white'
            }
          `}
        >
          {copyStatus === 'copied' ? <CheckIcon/> : <CopyIcon />}
          {copyStatus === 'copied' ? 'کپی شد!' : 'کپی کردن پرامپت'}
        </button>
        <button
          onClick={onClearAll}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-200"
        >
          <ClearIcon />
          پاک کردن همه
        </button>
      </div>
    </div>
  );
};

export default FinalPrompt;