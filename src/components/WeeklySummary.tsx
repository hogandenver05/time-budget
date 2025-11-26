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
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Week Summary</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Need */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Need</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatHours(summary.totalNeedHours)}
          </div>
        </div>

        {/* Want */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Want</div>
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatHours(summary.totalWantHours)}
          </div>
        </div>

        {/* Free Time */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Free Time</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {formatHours(summary.totalFreeTimeHours)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {formatPercentage(summary.freeTimePercentage)} of week
          </div>
        </div>

        {/* Biggest Category */}
        {summary.biggestCategory && (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Biggest Category</div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: summary.biggestCategory.color }}
              />
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {summary.biggestCategory.name}
              </div>
            </div>
            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {formatHours(summary.biggestCategory.hours)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

