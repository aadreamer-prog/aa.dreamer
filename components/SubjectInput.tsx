import React from 'react';

interface SubjectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const SubjectInput: React.FC<SubjectInputProps> = ({ value, onChange, isLoading }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg border border-slate-200 p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        ۱. سوژه اصلی (Subject)
      </h2>
      <p className="text-slate-500 mb-4">
        موضوع اصلی تصویر خود را توصیف کنید. متن شما به صورت خودکار به انگلیسی ترجمه می‌شود.
      </p>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="سوژه اصلی را اینجا بنویسید..."
        className={`w-full bg-slate-100 border-2 rounded-lg p-3 text-lg text-slate-800 focus:outline-none focus:ring-2 transition-all duration-300 ${
          isLoading 
            ? 'border-fuchsia-500 animate-pulse focus:ring-fuchsia-500' 
            : 'border-slate-300 focus:border-fuchsia-500 focus:ring-fuchsia-500'
        }`}
      />
    </div>
  );
};

export default SubjectInput;