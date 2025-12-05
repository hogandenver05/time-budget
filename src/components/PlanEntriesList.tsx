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
      <div className="p-8 text-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">
          No activities yet. Click "Add to Week" to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Activities</h2>
      <div className="space-y-3">
        {entries.map((entry) => {
          const category = categories.get(entry.categoryId);
          const categoryName = category?.name || 'Unknown';
          const categoryColor = category?.color || '#999';

          return (
            <div
              key={entry.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1 flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{categoryName}</span>
                    {entry.label && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">— {entry.label}</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        entry.priority === 'need'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      }`}
                    >
                      {entry.priority === 'need' ? 'Need' : 'Want'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDays(entry.daysOfWeek)} • {formatTime(entry.minutesPerDay)} per day
                    {entry.startTimeLocal && entry.endTimeLocal && (
                      <span> • {entry.startTimeLocal} - {entry.endTimeLocal}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={() => onEdit(entry)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this activity?')) {
                      onDelete(entry.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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

