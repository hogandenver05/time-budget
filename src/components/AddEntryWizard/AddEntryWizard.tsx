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
      // Calculate hours and minutes from minutesPerDay for Step 4
      const hours = Math.floor(initialEntry.minutesPerDay / 60);
      const minutes = initialEntry.minutesPerDay % 60;
      
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Progress indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: state.step >= step ? '#007bff' : '#e5e7eb',
                  marginRight: step < 4 ? '0.5rem' : 0,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
            <span>What</span>
            <span>Importance</span>
            <span>When</span>
            <span>How Long</span>
          </div>
        </div>

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

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <div>
            {state.step > 1 && (
              <button
                onClick={prevStep}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            {state.step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: canProceed() ? '#007bff' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: canProceed() ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                }}
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

