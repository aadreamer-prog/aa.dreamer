import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { CATEGORIES } from './constants';
import type { Category, MultiSelectCategory, ColorGridCategory } from './types';
import SubjectInput from './components/SubjectInput';
import PromptSection from './components/PromptSection';
import FinalPrompt from './components/FinalPrompt';
import SuggestionBox from './components/SuggestionBox';
import CameraAngleSection from './components/CameraAngleSection';
import ColorGridSection from './components/ColorGridSection';


// A simple debounce hook to prevent API calls on every keystroke
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const App: React.FC = () => {
  const [ai, setAi] = useState<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    }
  }, []);

  const [promptState, setPromptState] = useState<Record<string, string | string[]>>({
    subject: '',
    ...Object.fromEntries(
      CATEGORIES.map(cat => [cat.id, (cat.type === 'multi-select-grouped' || cat.type === 'color-grid') ? [] : ''])
    ),
  });

  const [translatedSubject, setTranslatedSubject] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isHumanSubject, setIsHumanSubject] = useState(false);
  const [isCheckingSubject, setIsCheckingSubject] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [addedSuggestions, setAddedSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const debouncedSubject = useDebounce(promptState.subject as string, 500);

  useEffect(() => {
    if (!ai || !debouncedSubject) {
      setTranslatedSubject('');
      return;
    }

    const translateSubject = async () => {
      setIsTranslating(true);
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Your task is to prepare a subject phrase for an AI image generator. Analyze the following text. If the text is in a language other than English, translate it into a concise, descriptive English phrase suitable for the prompt. If the text is ALREADY in English, you MUST return the original text verbatim, without any changes or additions. Text to process: "${debouncedSubject}"`,
        });
        setTranslatedSubject(response.text.trim());
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedSubject(debouncedSubject); // Fallback to original text on error
      } finally {
        setIsTranslating(false);
      }
    };

    translateSubject();
  }, [debouncedSubject, ai]);

    useEffect(() => {
        if (!ai || !translatedSubject) {
          setIsHumanSubject(false);
          return;
        }

        const checkSubjectType = async () => {
          setIsCheckingSubject(true);
          try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the following subject for an image generation prompt: "${translatedSubject}". Does it primarily describe one or more humans, people, or human-like characters (e.g., man, woman, girl, boy, cyborg, elf)? Respond with only the word "Yes" or "No".`,
                config: { thinkingConfig: { thinkingBudget: 0 } },
            });
            setIsHumanSubject(response.text.trim().toLowerCase().includes('yes'));
          } catch (error) {
            console.error("Subject type check error:", error);
            setIsHumanSubject(false); // Default to false on error
          } finally {
            setIsCheckingSubject(false);
          }
        };

        const timer = setTimeout(() => {
            checkSubjectType();
        }, 200);

        return () => clearTimeout(timer);
    }, [translatedSubject, ai]);


  useEffect(() => {
    const { subject, ...details } = promptState;
    const promptParts = [
      translatedSubject,
      ...CATEGORIES.map(cat => {
        const value = details[cat.id];
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      }).filter(Boolean),
      ...addedSuggestions,
    ];
    setFinalPrompt(promptParts.filter(part => part && part.trim() !== '').join(', '));
  }, [promptState, translatedSubject, addedSuggestions]);

  const handleSelection = (categoryId: string, value: string) => {
    setPromptState(prevState => ({
      ...prevState,
      [categoryId]: prevState[categoryId] === value ? '' : value,
    }));
  };

  const handleCameraSelection = (subCategoryTitle: string, value: string, selectionType: 'single' | 'multiple') => {
      const cameraCategory = CATEGORIES.find(c => c.id === 'cameraAngle') as MultiSelectCategory;
      const subCategory = cameraCategory?.subCategories.find(sc => sc.title === subCategoryTitle);
      if (!subCategory) return;

      setPromptState(prevState => {
          const prevValues = prevState['cameraAngle'] as string[];
          let newValues = [...prevValues];

          if (selectionType === 'single') {
              const isAlreadySelected = newValues.includes(value);
              const optionsInSubCategory = subCategory.options.map(opt => opt.value);
              newValues = newValues.filter(v => !optionsInSubCategory.includes(v));

              if (!isAlreadySelected) {
                  newValues.push(value);
              }
          } else { // 'multiple'
              if (newValues.includes(value)) {
                  newValues = newValues.filter(v => v !== value);
              } else {
                  newValues.push(value);
              }
          }

          return { ...prevState, cameraAngle: newValues };
      });
  };

    const handleColorSelection = (value: string) => {
        setPromptState(prevState => {
            const currentColors = prevState['specificColors'] as string[];
            const newColors = currentColors.includes(value)
                ? currentColors.filter(c => c !== value)
                : [...currentColors, value];
            return { ...prevState, specificColors: newColors };
        });
    };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptState(prevState => ({
      ...prevState,
      subject: e.target.value,
    }));
  };
  
  const handleClearAll = () => {
    const clearedState: Record<string, string | string[]> = { subject: '' };
    CATEGORIES.forEach(cat => {
      clearedState[cat.id] = (cat.type === 'multi-select-grouped' || cat.type === 'color-grid') ? [] : '';
    });
    setPromptState(clearedState);
    setSuggestions([]);
    setAddedSuggestions([]);
  };

  const handleGetSuggestions = async () => {
    if (!finalPrompt || !ai) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this AI image prompt: "${finalPrompt}", suggest 4 creative details, moods, or styles to add. Return them as a JSON array of strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "List of 4 creative suggestions.",
                            items: {
                                type: Type.STRING,
                                description: "A single suggestion phrase."
                            }
                        }
                    },
                    required: ["suggestions"],
                },
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        
        const result = JSON.parse(response.text);
        setSuggestions(result.suggestions || []);

    } catch (error) {
        console.error("Suggestion error:", error);
        setSuggestions(['dramatic lighting', 'highly detailed', 'fantasy art', 'cinematic']);
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (!addedSuggestions.includes(suggestion)) {
        setAddedSuggestions(prev => [...prev, suggestion]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 pb-2">
            دستیار ساخت پرامپت
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            پرامپت‌های حرفه‌ای برای تولید عکس با هوش مصنوعی بسازید
          </p>
        </header>

        <div className="w-full lg:grid lg:grid-cols-3 lg:gap-8">
          <main className="lg:col-span-2">
            {!ai && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg mb-6 text-center">
                برای استفاده از قابلیت ترجمه و پیشنهاددهی، کلید API خود را تنظیم کنید.
              </div>
            )}

            <SubjectInput 
              value={promptState.subject as string} 
              onChange={handleSubjectChange}
              isLoading={isTranslating || isCheckingSubject}
            />

            {CATEGORIES.map((category) => {
              if (category.type === 'simple') {
                const isDisabled = (category.id === 'facialExpression' || category.id === 'pose') && !isHumanSubject;
                return (
                  <PromptSection
                    key={category.id}
                    title={category.title}
                    options={category.options}
                    selectedValue={promptState[category.id] as string}
                    onSelect={(value) => handleSelection(category.id, value)}
                    disabled={isDisabled}
                    initialOpen={category.id === 'style'}
                  />
                );
              }
              if (category.type === 'multi-select-grouped') {
                  return (
                      <CameraAngleSection
                          key={category.id}
                          category={category}
                          selectedValues={promptState[category.id] as string[]}
                          onSelect={handleCameraSelection}
                      />
                  )
              }
              if (category.type === 'color-grid') {
                  return (
                      <ColorGridSection
                          key={category.id}
                          title={category.title}
                          groups={category.groups}
                          selectedValues={promptState[category.id] as string[]}
                          onSelect={handleColorSelection}
                      />
                  )
              }
              return null;
            })}
          </main>

          <aside className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
            <FinalPrompt promptText={finalPrompt} onClearAll={handleClearAll} />

            <SuggestionBox
              promptText={finalPrompt}
              onGenerateSuggestions={handleGetSuggestions}
              suggestions={suggestions}
              addedSuggestions={addedSuggestions}
              isSuggesting={isSuggesting}
              onAddSuggestion={handleAddSuggestion}
              disabled={!ai}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;