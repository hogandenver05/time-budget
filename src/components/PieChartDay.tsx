import { useRef, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { DayBreakdown } from '../utils/aggregation';

interface PieChartDayProps {
  dayBreakdown: DayBreakdown;
  dayName: string;
  showHeader?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export function PieChartDay({
  dayBreakdown,
  dayName,
  showHeader = true,
  hoverable = true,
  onClick,
}: PieChartDayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height: width * 0.75 });
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const outerRadius = containerSize.width ? containerSize.width * 0.25 : 60;

  const formatMinutes = (minutes: number) => {
    if (minutes === 0) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const chartData = dayBreakdown.categoryTotals.map((cat) => ({
    name: cat.categoryName,
    value: cat.minutes,
    color: cat.categoryColor,
  }));

  const totalMinutes = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const getOverageSeverity = (total: number) =>
    total <= 1440 ? 'none' : total <= 1440 * 1.25 ? 'warning' : 'danger';
  const overageSeverity = getOverageSeverity(totalMinutes);

  const overageStyles: Record<typeof overageSeverity, string> = {
    none: '',
    warning: 'ring-2 ring-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]',
    danger: 'ring-2 ring-red-500 shadow-[0_0_14px_rgba(239,68,68,0.6)]',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="m-0 font-semibold text-gray-900 dark:text-white">{data.name}</p>
        <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{formatMinutes(data.value)}</p>
      </div>
    );
  };

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / 1440) * 100).toFixed(0);
    if (percent === '0') return '';
    return `${percent}%`;
  };

  if (!chartData.length) {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-center">
        {showHeader && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{dayName}</h3>}
        <p className="text-gray-600 dark:text-gray-400 mb-4">No activities planned</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={[
        'p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl',
        'bg-white dark:bg-gray-800 shadow-sm transition-all duration-200',
        hoverable ? 'hover:dark:border-gray-500' : '',
        onClick ? 'cursor-pointer' : '',
        overageStyles[overageSeverity],
      ].join(' ')}
    >
      {showHeader && <h3 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">{dayName}</h3>}

      <div ref={containerRef} className="w-full">
        <ResponsiveContainer width="100%" height={containerSize.height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              innerRadius={0}
              dataKey="value"
              label={renderLabel}
              animationDuration={500}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-700 dark:text-gray-300 truncate">{entry.name}</span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">{formatMinutes(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

