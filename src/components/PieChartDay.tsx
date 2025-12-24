import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
  
  // Derive a severity level from total minutes and map it to a shadow style
  function getOverageSeverity(totalMinutes: number): "none" | "warning" | "danger" {
    const minutesInDay = 24 * 60;
    if (totalMinutes <= minutesInDay) return "none";
    if (totalMinutes <= minutesInDay * 1.25) return "warning";
    return "danger";
  };
  
  const totalMinutes = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const overageSeverity = getOverageSeverity(totalMinutes);
  const overageStyles: Record<typeof overageSeverity, string> = {
    none: "",
    warning:
      "ring-2 ring-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]",
    danger:
      "ring-2 ring-red-500 shadow-[0_0_14px_rgba(239,68,68,0.6)]",
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="m-0 font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{formatMinutes(data.value)}</p>
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
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{dayName}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No activities planned</p>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">24 hours free</p>
        </div>
      </div>
    );
  }

  return (
    <div className={[
      "p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl",
      "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
      "transition-all duration-200",
      overageStyles[overageSeverity],
    ].join(" ")}>
    <h3 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
      <span>{dayName}</span>
      {overageSeverity !== "none" && (
        <span
          className={
            overageSeverity === "warning"
              ? "text-orange-300"
              : "text-red-500"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            />
          </svg>
        </span>
      )}
    </h3>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={60}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="space-y-1">
        {chartData.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {entry.name}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">
              {formatMinutes(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

