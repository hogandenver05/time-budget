import type { WizardState } from './AddEntryWizard';

interface Step3WhenProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
}

const DAY_ABBREVIATIONS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Step3When({ state, updateState }: Step3WhenProps) {
  const toggleDay = (day: number) => {
    const newDays = state.daysOfWeek.includes(day)
      ? state.daysOfWeek.filter((d) => d !== day)
      : [...state.daysOfWeek, day].sort();
    updateState({ daysOfWeek: newDays });
  };

  const selectEveryDay = () => {
    updateState({ daysOfWeek: [0, 1, 2, 3, 4, 5, 6] });
  };

  const selectWeekdays = () => {
    updateState({ daysOfWeek: [1, 2, 3, 4, 5] });
  };

  const clearDays = () => {
    updateState({ daysOfWeek: [] });
  };

  return (
    <div className="pb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">When?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select which days of the week this activity applies to.
      </p>

      {/* Day chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {DAY_ABBREVIATIONS.map((abbr, index) => {
          const isSelected = state.daysOfWeek.includes(index);
          return (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full font-bold text-base sm:text-lg transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-md scale-110'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-sm'
              }`}
              title={DAY_NAMES[index]}
            >
              {abbr}
            </button>
          );
        })}
      </div>

      {/* Shortcuts */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Shortcuts:</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={selectEveryDay}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Every day
          </button>
          <button
            onClick={selectWeekdays}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Weekdays
          </button>
          {state.daysOfWeek.length > 0 && (
            <button
              onClick={clearDays}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Selected days summary */}
      {state.daysOfWeek.length > 0 && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 m-0">
            <strong className="font-semibold">Selected:</strong>{' '}
            {state.daysOfWeek.map((day) => DAY_NAMES[day]).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

