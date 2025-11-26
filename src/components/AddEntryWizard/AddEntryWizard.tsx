import { useState } from 'react';
import { Step1What } from './Step1What';
import { Step2Importance } from './Step2Importance';
import { Step3When } from './Step3When';
import { Step4HowLong } from './Step4HowLong';
import type { Category } from '../../types/category';
import type { Priority, PlanEntry } from '../../types/plan';

export interface WizardState {
  step: number;
  categoryId: string | null;
  categoryName: string | null; // For new categories
  categoryColor: string;
  label: string;
  priority: Priority | null;
  daysOfWeek: number[];
  minutesPerDay: number;
  startTimeLocal: string | null;
  endTimeLocal: string | null;
}

interface AddEntryWizardProps {
  categories: (Category & { id: string })[];
  onClose: () => void;
  onComplete: (state: WizardState) => Promise<void>;
  initialEntry?: (PlanEntry & { id: string }) | null;
  entryId?: string | null;
}

export function AddEntryWizard({ categories, onClose, onComplete, initialEntry, entryId }: AddEntryWizardProps) {
  const isEditing = !!initialEntry && !!entryId;
  
  // Initialize state from entry if editing, otherwise use defaults
  const getInitialState = (): WizardState => {
    if (initialEntry) {
      return {
        step: 1,
        categoryId: initialEntry.categoryId,
        categoryName: null,
        categoryColor: categories.find((c) => c.id === initialEntry.categoryId)?.color || '#6366f1',
        label: initialEntry.label || '',
        priority: initialEntry.priority,
        daysOfWeek: initialEntry.daysOfWeek,
        minutesPerDay: initialEntry.minutesPerDay,
        startTimeLocal: initialEntry.startTimeLocal || null,
        endTimeLocal: initialEntry.endTimeLocal || null,
      };
    }
    
    return {
      step: 1,
      categoryId: null,
      categoryName: null,
      categoryColor: '#6366f1',
      label: '',
      priority: null,
      daysOfWeek: [],
      minutesPerDay: 0,
      startTimeLocal: null,
      endTimeLocal: null,
    };
  };

  const [state, setState] = useState<WizardState>(getInitialState());

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.step < 4) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleComplete = async () => {
    await onComplete(state);
  };

  const canProceed = () => {
    switch (state.step) {
      case 1:
        return state.categoryId !== null || (state.categoryName !== null && state.categoryName.trim() !== '');
      case 2:
        return state.priority !== null;
      case 3:
        return state.daysOfWeek.length > 0;
      case 4:
        return state.minutesPerDay > 0;
      default:
        return false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col sm:mx-4">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Entry' : 'Add to Week'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  state.step >= step
                    ? 'bg-primary-600 dark:bg-primary-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className={state.step === 1 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              What
            </span>
            <span className={state.step === 2 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              Importance
            </span>
            <span className={state.step === 3 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              When
            </span>
            <span className={state.step === 4 ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}>
              How Long
            </span>
          </div>
        </div>

        {/* Step content - scrollable */}
        <div className="flex-1 overflow-y-auto px-6">

        {/* Step content */}
        {state.step === 1 && (
          <Step1What
            categories={categories}
            state={state}
            updateState={updateState}
          />
        )}
        {state.step === 2 && (
          <Step2Importance
            state={state}
            updateState={updateState}
          />
        )}
        {state.step === 3 && (
          <Step3When
            state={state}
            updateState={updateState}
          />
        )}
        {state.step === 4 && (
          <Step4HowLong
            state={state}
            updateState={updateState}
          />
        )}

        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div>
            {state.step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            {state.step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-primary-600 hover:bg-primary-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isEditing ? 'Update Entry' : 'Add to Week'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

