// tavern/llm-params-menu.tsx
'use client';

import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export type LLMParams = {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
};

export function useLLMParams(initialParams: Partial<LLMParams> = {}) {
  const [params, setParams] = useState<LLMParams>({
    temperature: initialParams.temperature ?? 0.7,
    maxTokens: initialParams.maxTokens ?? 500,
    topP: initialParams.topP ?? 0.9,
    frequencyPenalty: initialParams.frequencyPenalty ?? 0,
    presencePenalty: initialParams.presencePenalty ?? 0,
  });

  const [isOpen, setIsOpen] = useState(false);

  return {
    params,
    setParams,
    isOpen,
    toggleMenu: () => setIsOpen(!isOpen),
  };
}

export function LLMParamsMenu({
  params,
  onParamsChange,
  isOpen,
  onClose,
}: {
  params: LLMParams;
  onParamsChange: (params: LLMParams) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a1414] border border-[#5c2d2d] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-medium text-[#e8c8a0] mb-4">LLM Parameters</h2>
        
        <div className="space-y-4">
          {[
            { id: 'temperature', label: 'Temperature', min: 0, max: 2, step: 0.1 },
            { id: 'maxTokens', label: 'Max Tokens', min: 100, max: 2000, step: 50 },
            { id: 'topP', label: 'Top P', min: 0, max: 1, step: 0.05 },
            { id: 'frequencyPenalty', label: 'Frequency Penalty', min: 0, max: 2, step: 0.1 },
            { id: 'presencePenalty', label: 'Presence Penalty', min: 0, max: 2, step: 0.1 },
          ].map((param) => (
            <div key={param.id}>
              <label className="block text-[#d4a76a] font-serif mb-1">
                {param.label}: {params[param.id as keyof LLMParams]}
              </label>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={params[param.id as keyof LLMParams]}
                onChange={(e) => 
                  onParamsChange({
                    ...params,
                    [param.id]: parseFloat(e.target.value),
                  })
                }
                className="w-full h-2 bg-[#3a2020] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5c2d2d] text-[#e8c8a0] rounded hover:bg-[#8a4b4b]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}