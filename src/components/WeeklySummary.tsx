import { useNavigate } from 'react-router-dom';
import type { WeeklySummary } from '../utils/summary';

interface WeeklySummaryProps {
  summary: WeeklySummary;
  onClick?: () => void;
  onAddEntry?: () => void;
}

export function WeeklySummary({ summary, onClick, onAddEntry }: WeeklySummaryProps) {
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

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onClick) {
      onClick();
    } else {
      navigate('/entries');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
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
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onAddEntry) {
              onAddEntry();
            }
          }}
          className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add to Week
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) {
              onClick();
            } else {
              navigate('/entries');
            }
          }}
          className="w-full px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Manage Activities →
        </button>
      </div>
    </div>
  );
}

