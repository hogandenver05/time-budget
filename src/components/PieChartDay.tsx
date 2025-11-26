import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DayBreakdown } from '../utils/aggregation';

interface PieChartDayProps {
  dayBreakdown: DayBreakdown;
  dayName: string;
}

export function PieChartDay({ dayBreakdown, dayName }: PieChartDayProps) {
  // Convert minutes to hours for display
  const formatMinutes = (minutes: number): string => {
    if (minutes === 0) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Prepare data for Recharts
  const chartData = dayBreakdown.categoryTotals.map((cat) => ({
    name: cat.categoryName,
    value: cat.minutes,
    color: cat.categoryColor,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: 0 }}>{formatMinutes(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / 1440) * 100).toFixed(0);
    if (percent === '0') return '';
    return `${percent}%`;
  };

  if (chartData.length === 0) {
    return (
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{dayName}</h3>
        <p>No activities planned</p>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#999' }}>24 hours free</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '1rem', textAlign: 'center' }}>{dayName}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              const data = chartData.find((d) => d.name === value);
              return data ? `${value} (${formatMinutes(data.value)})` : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

