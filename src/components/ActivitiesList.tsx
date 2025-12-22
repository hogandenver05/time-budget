import type { Activity } from '../types/activity';
import type { Category } from '../types/category';
import { formatTo12Hour } from './FormatTo12Hour';

const DAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ActivitiesListProps {
  entries: (Activity & { id: string })[];
  categories: Map<string, Category & { id: string }>;
  onEdit: (entry: Activity & { id: string }) => void;
  onDelete: (entryId: string) => void;
}

export function ActivitiesList({ entries, categories, onEdit, onDelete }: ActivitiesListProps) {
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
                    <span className="font-semibold text-gray-900 dark:text-white">{entry.label ?? categoryName}</span>
                    {entry.label && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">— {categoryName}</span>
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
                      <span> • {formatTo12Hour(entry.startTimeLocal)} - {formatTo12Hour(entry.endTimeLocal)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={() => onEdit(entry)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="white"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={0.5}
                      // d="M11 5h2m2 2l-9 9-4 1 1-4 9-9a2.828 2.828 0 114 4z"
                      d="M18.4324 4C18.2266 4 18.0227 4.04055 17.8325 4.11933C17.6423 4.19811 17.4695 4.31358 17.3239 4.45914L5.25659 16.5265L4.42524 19.5748L7.47353 18.7434L19.5409 6.67608C19.6864 6.53051 19.8019 6.3577 19.8807 6.16751C19.9595 5.97732 20 5.77348 20 5.56761C20 5.36175 19.9595 5.1579 19.8807 4.96771C19.8019 4.77752 19.6864 4.60471 19.5409 4.45914C19.3953 4.31358 19.2225 4.19811 19.0323 4.11933C18.8421 4.04055 18.6383 4 18.4324 4ZM17.0671 2.27157C17.5 2.09228 17.9639 2 18.4324 2C18.9009 2 19.3648 2.09228 19.7977 2.27157C20.2305 2.45086 20.6238 2.71365 20.9551 3.04493C21.2864 3.37621 21.5492 3.7695 21.7285 4.20235C21.9077 4.63519 22 5.09911 22 5.56761C22 6.03611 21.9077 6.50003 21.7285 6.93288C21.5492 7.36572 21.2864 7.75901 20.9551 8.09029L8.69996 20.3454C8.57691 20.4685 8.42387 20.5573 8.25597 20.6031L3.26314 21.9648C2.91693 22.0592 2.54667 21.9609 2.29292 21.7071C2.03917 21.4534 1.94084 21.0831 2.03526 20.7369L3.39694 15.7441C3.44273 15.5762 3.53154 15.4231 3.6546 15.3001L15.9097 3.04493C16.241 2.71365 16.6343 2.45086 17.0671 2.27157Z" 
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this activity?')) {
                      onDelete(entry.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                      // d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2"
                      d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

