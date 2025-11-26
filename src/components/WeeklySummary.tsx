import type { WeeklySummary } from '../utils/summary';

interface WeeklySummaryProps {
  summary: WeeklySummary;
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Week Summary</h2>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Need vs Want */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Need</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
            {formatHours(summary.totalNeedHours)}
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Want</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
            {formatHours(summary.totalWantHours)}
          </div>
        </div>

        {/* Free Time */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Free Time</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c757d' }}>
            {formatHours(summary.totalFreeTimeHours)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
            {formatPercentage(summary.freeTimePercentage)} of week
          </div>
        </div>

        {/* Biggest Category */}
        {summary.biggestCategory && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #dee2e6',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Biggest Category</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: summary.biggestCategory.color,
                }}
              />
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{summary.biggestCategory.name}</div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#495057' }}>
              {formatHours(summary.biggestCategory.hours)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

