import { useState, useEffect } from 'react';
import type { WizardState } from './AddEntryWizard';

interface Step4HowLongProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
}

export function Step4HowLong({ state, updateState }: Step4HowLongProps) {
  const [useSpecificTimes, setUseSpecificTimes] = useState(!!(state.startTimeLocal && state.endTimeLocal));
  
  // Initialize hours and minutes from minutesPerDay
  const getInitialHours = () => Math.floor(state.minutesPerDay / 60);
  const getInitialMinutes = () => state.minutesPerDay % 60;
  
  const [hours, setHours] = useState(getInitialHours());
  const [minutes, setMinutes] = useState(getInitialMinutes());
  
  // Update local state when state.minutesPerDay changes (e.g., when editing)
  useEffect(() => {
    if (state.minutesPerDay > 0 && !useSpecificTimes) {
      setHours(getInitialHours());
      setMinutes(getInitialMinutes());
    }
  }, [state.minutesPerDay, useSpecificTimes]);

  // Calculate minutes from hours and minutes input
  const calculateMinutes = (h: number, m: number) => {
    return h * 60 + m;
  };

  // Update minutesPerDay when hours or minutes change
  const handleDurationChange = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    updateState({ minutesPerDay: calculateMinutes(h, m) });
  };

  // Calculate minutes from start/end times
  const calculateMinutesFromTimes = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    return endTotal >= startTotal ? endTotal - startTotal : 1440 - startTotal + endTotal;
  };

  const handleTimeChange = (start: string, end: string) => {
    updateState({
      startTimeLocal: start,
      endTimeLocal: end,
      minutesPerDay: calculateMinutesFromTimes(start, end),
    });
  };

  return (
    <div className="pb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">How long?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Set the time per day for this activity. You can use a duration or specific start and end times.
      </p>

      {/* Toggle between duration and specific times */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <input
            type="checkbox"
            checked={useSpecificTimes}
            onChange={(e) => {
              setUseSpecificTimes(e.target.checked);
              if (!e.target.checked) {
                // Reset times when unchecking
                updateState({ startTimeLocal: null, endTimeLocal: null });
              }
            }}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Set specific times</span>
        </label>
      </div>

      {!useSpecificTimes ? (
        /* Duration input */
        <div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours
              </label>
              <input
                id="hours"
                type="number"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => {
                  const h = Math.max(0, Math.min(24, parseInt(e.target.value) || 0));
                  handleDurationChange(h, minutes);
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minutes
              </label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  const m = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                  handleDurationChange(hours, m);
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          {state.minutesPerDay > 0 && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 m-0">
                <strong className="font-semibold">Total:</strong> {Math.floor(state.minutesPerDay / 60)}h{' '}
                {state.minutesPerDay % 60}m per day
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Start and end time pickers */
        <div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                value={state.startTimeLocal || ''}
                onChange={(e) => {
                  const start = e.target.value;
                  if (state.endTimeLocal) {
                    handleTimeChange(start, state.endTimeLocal);
                  } else {
                    updateState({ startTimeLocal: start });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                value={state.endTimeLocal || ''}
                onChange={(e) => {
                  const end = e.target.value;
                  if (state.startTimeLocal) {
                    handleTimeChange(state.startTimeLocal, end);
                  } else {
                    updateState({ endTimeLocal: end });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          {state.minutesPerDay > 0 && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 m-0">
                <strong className="font-semibold">Duration:</strong> {Math.floor(state.minutesPerDay / 60)}h{' '}
                {state.minutesPerDay % 60}m per day
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

