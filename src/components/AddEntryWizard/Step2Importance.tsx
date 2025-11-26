import type { WizardState } from './AddEntryWizard';
import type { Priority } from '../../types/plan';

interface Step2ImportanceProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
}

export function Step2Importance({ state, updateState }: Step2ImportanceProps) {
  const handlePrioritySelect = (priority: Priority) => {
    updateState({ priority });
  };

  return (
    <div className="pb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Importance</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Is this activity a Need or a Want for you?
      </p>

      <div className="space-y-4">
        <button
          onClick={() => handlePrioritySelect('need')}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            state.priority === 'need'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                state.priority === 'need'
                  ? 'border-red-500 bg-red-500'
                  : 'border-gray-300 dark:border-gray-600 bg-transparent'
              }`}
            >
              {state.priority === 'need' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Need</span>
          </div>
          <p className="m-0 text-sm text-gray-600 dark:text-gray-400">
            Non-negotiable time you intend to protect
          </p>
        </button>

        <button
          onClick={() => handlePrioritySelect('want')}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            state.priority === 'want'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                state.priority === 'want'
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 dark:border-gray-600 bg-transparent'
              }`}
            >
              {state.priority === 'want' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Want</span>
          </div>
          <p className="m-0 text-sm text-gray-600 dark:text-gray-400">
            Flexible time you want to make space for
          </p>
        </button>
      </div>
    </div>
  );
}

