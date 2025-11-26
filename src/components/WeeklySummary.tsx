import { useNavigate } from 'react-router-dom';
import type { WeeklySummary } from '../utils/summary';

interface WeeklySummaryProps {
  summary: WeeklySummary;
  onClick?: () => void;
}

export function WeeklySummary({ summary, onClick }: WeeklySummaryProps) {
  const navigate = useNavigate();
  
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/entries');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Week Summary
      </h3>
      
      <div className="space-y-3">
        {/* Need */}
        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Need</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatHours(summary.totalNeedHours)}
          </div>
        </div>

        {/* Want */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Want</div>
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {formatHours(summary.totalWantHours)}
          </div>
        </div>

        {/* Free Time */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Free Time</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {formatPercentage(summary.freeTimePercentage)} of week
            </div>
          </div>
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {formatHours(summary.totalFreeTimeHours)}
          </div>
        </div>

        {/* Biggest Category */}
        {summary.biggestCategory && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: summary.biggestCategory.color }}
              />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Biggest</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {summary.biggestCategory.name}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {formatHours(summary.biggestCategory.hours)}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
          Click to manage entries →
        </div>
      </div>
    </div>
  );
}

