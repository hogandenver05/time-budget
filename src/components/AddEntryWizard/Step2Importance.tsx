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
    <div>
      <h2 style={{ marginTop: 0 }}>Importance</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Is this activity a Need or a Want for you?
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <button
          onClick={() => handlePrioritySelect('need')}
          style={{
            padding: '1.5rem',
            border: state.priority === 'need' ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: state.priority === 'need' ? '#f0f8ff' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: state.priority === 'need' ? '#007bff' : '#ddd',
                backgroundColor: state.priority === 'need' ? '#007bff' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {state.priority === 'need' && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Need</span>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
            Non-negotiable time you intend to protect
          </p>
        </button>

        <button
          onClick={() => handlePrioritySelect('want')}
          style={{
            padding: '1.5rem',
            border: state.priority === 'want' ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: state.priority === 'want' ? '#f0f8ff' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: state.priority === 'want' ? '#007bff' : '#ddd',
                backgroundColor: state.priority === 'want' ? '#007bff' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {state.priority === 'want' && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Want</span>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
            Flexible time you want to make space for
          </p>
        </button>
      </div>
    </div>
  );
}

