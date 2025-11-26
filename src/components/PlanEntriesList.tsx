import type { PlanEntry } from '../types/plan';
import type { Category } from '../types/category';

const DAY_ABBREVIATIONS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface PlanEntriesListProps {
  entries: (PlanEntry & { id: string })[];
  categories: Map<string, Category & { id: string }>;
  onEdit: (entry: PlanEntry & { id: string }) => void;
  onDelete: (entryId: string) => void;
}

export function PlanEntriesList({ entries, categories, onEdit, onDelete }: PlanEntriesListProps) {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatDays = (days: number[]): string => {
    if (days.length === 0) return 'No days';
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every((d) => [1, 2, 3, 4, 5].includes(d))) {
      return 'Weekdays';
    }
    return days
      .sort()
      .map((day) => DAY_ABBREVIATIONS[day])
      .join(', ');
  };

  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <p>No plan entries yet. Click "Add to Week" to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Plan Entries</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {entries.map((entry) => {
          const category = categories.get(entry.categoryId);
          const categoryName = category?.name || 'Unknown';
          const categoryColor = category?.color || '#999';

          return (
            <div
              key={entry.id}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: categoryColor,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong>{categoryName}</strong>
                    {entry.label && (
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>— {entry.label}</span>
                    )}
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: entry.priority === 'need' ? '#dc3545' : '#007bff',
                        color: 'white',
                      }}
                    >
                      {entry.priority === 'need' ? 'Need' : 'Want'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {formatDays(entry.daysOfWeek)} • {formatTime(entry.minutesPerDay)} per day
                    {entry.startTimeLocal && entry.endTimeLocal && (
                      <span> • {entry.startTimeLocal} - {entry.endTimeLocal}</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onEdit(entry)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this entry?')) {
                      onDelete(entry.id);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

