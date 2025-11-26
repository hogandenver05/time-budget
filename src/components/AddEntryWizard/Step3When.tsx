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
    updateState({ daysOfWeek: [1, 2, 3, 4, 5] }); // Monday through Friday
  };

  const clearDays = () => {
    updateState({ daysOfWeek: [] });
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>When?</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Select which days of the week this activity applies to.
      </p>

      {/* Day chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {DAY_ABBREVIATIONS.map((abbr, index) => {
          const isSelected = state.daysOfWeek.includes(index);
          return (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: isSelected ? '#007bff' : 'white',
                color: isSelected ? 'white' : '#333',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={DAY_NAMES[index]}
            >
              {abbr}
            </button>
          );
        })}
      </div>

      {/* Shortcuts */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Shortcuts:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={selectEveryDay}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Every day
          </button>
          <button
            onClick={selectWeekdays}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Weekdays
          </button>
          {state.daysOfWeek.length > 0 && (
            <button
              onClick={clearDays}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Selected days summary */}
      {state.daysOfWeek.length > 0 && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Selected:</strong>{' '}
          {state.daysOfWeek
            .map((day) => DAY_NAMES[day])
            .join(', ')}
        </div>
      )}
    </div>
  );
}

