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
    <div>
      <h2 style={{ marginTop: 0 }}>How long?</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Set the time per day for this activity. You can use a duration or specific start and end times.
      </p>

      {/* Toggle between duration and specific times */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
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
          />
          <span>Set specific times</span>
        </label>
      </div>

      {!useSpecificTimes ? (
        /* Duration input */
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="hours" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="minutes" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>
          {state.minutesPerDay > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
              <strong>Total:</strong> {Math.floor(state.minutesPerDay / 60)}h {state.minutesPerDay % 60}m per day
            </div>
          )}
        </div>
      ) : (
        /* Start and end time pickers */
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="startTime" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="endTime" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>
          {state.minutesPerDay > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
              <strong>Duration:</strong> {Math.floor(state.minutesPerDay / 60)}h {state.minutesPerDay % 60}m per day
            </div>
          )}
        </div>
      )}
    </div>
  );
}

