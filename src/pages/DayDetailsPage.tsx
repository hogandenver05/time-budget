import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getActivities,
  getCategories,
  createActivity,
  updateActivity,
  deleteActivity,
  createCategory,
} from '../firebase/firestore';
import { aggregateActivities } from '../utils/aggregation';
import { PieChartDay } from '../components/PieChartDay';
import { ActivitiesList } from '../components/ActivitiesList';
import { AddEntryWizard, type WizardState } from '../components/AddEntryWizard/AddEntryWizard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Activity } from '../types/activity';
import type { Category } from '../types/category';
import { Skeleton } from '../components/Skeleton';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function DayDetailsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { dayIndex } = useParams<{ dayIndex: string }>();

  const day = Number(dayIndex);

  const [activities, setActivities] = useState<(Activity & { id: string })[]>([]);
  const [categories, setCategories] = useState<(Category & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [editingEntry, setEditingEntry] = useState<(Activity & { id: string }) | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, day]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [allActivities, allCategories] = await Promise.all([
        getActivities(user.uid),
        getCategories(user.uid),
      ]);

      setCategories(allCategories);

      setActivities(
        allActivities.filter((activity) =>
          activity.daysOfWeek.includes(day)
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load day data');
    } finally {
      setLoading(false);
    }
  };

  const categoriesMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat])),
    [categories]
  );

  const dayBreakdown = useMemo(() => {
    const all = aggregateActivities(activities, categoriesMap);
    return all.find((d) => d.dayOfWeek === day);
  }, [activities, categoriesMap, day]);

  const handleWizardComplete = async (wizardState: WizardState) => {
    if (!user) return;

    let categoryId = wizardState.categoryId;

    if (!categoryId && wizardState.categoryName) {
      categoryId = await createCategory(user.uid, {
        name: wizardState.categoryName,
        color: wizardState.categoryColor,
        builtIn: false,
      });
    }

    if (!categoryId) {
      throw new Error('Category is required');
    }

    if (editingEntry) {
      await updateActivity(user.uid, editingEntry.id, {
        categoryId,
        label: wizardState.label || undefined,
        priority: wizardState.priority!,
        daysOfWeek: [day],
        minutesPerDay: wizardState.minutesPerDay,
        startTimeLocal: wizardState.startTimeLocal || undefined,
        endTimeLocal: wizardState.endTimeLocal || undefined,
      });
    } else {
      await createActivity(user.uid, {
        categoryId,
        label: wizardState.label || undefined,
        priority: wizardState.priority!,
        daysOfWeek: [day],
        minutesPerDay: wizardState.minutesPerDay,
        startTimeLocal: wizardState.startTimeLocal || undefined,
        endTimeLocal: wizardState.endTimeLocal || undefined,
      });
    }

    setShowWizard(false);
    setEditingEntry(null);
    await loadData();
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowWizard(true);
  };

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading {DAY_NAMES[day]}'s activities...</p>
          <div className="w-full max-w-4xl space-y-4 mt-8">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      );
    }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-1">
                Error loading data
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 flex items-center gap-2 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Weekly View
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {DAY_NAMES[day]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edit, delete, or add new activities
          </p>
        </div>
        <button
          onClick={handleAddEntry}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
          Add Activity
        </button>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pie */}
        <div className="rounded-xl shadow-sm">
          {dayBreakdown && (
            <PieChartDay
              dayBreakdown={dayBreakdown}
              dayName={DAY_NAMES[day]}
              showHeader={false}
              hoverable={false}
            />
          )}
        </div>

        {/* Right: Activities */}
        <div className="rounded-xl shadow-sm overflow-y-auto max-h-[70vh]">
          <ActivitiesList
            entries={activities}
            categories={categoriesMap}
            onEdit={(entry) => {
              setEditingEntry(entry);
              setShowWizard(true);
            }}
            onDelete={async (id) => {
              if (!user) return;
              await deleteActivity(user.uid, id);
              await loadData();
            }}
          />
        </div>
      </div>

      {showWizard && (
        <AddEntryWizard
          categories={categories}
          initialEntry={editingEntry}
          initialDaysOfWeek={editingEntry ? undefined : [day]}
          entryId={editingEntry?.id || null}
          onClose={() => {
            setShowWizard(false);
            setEditingEntry(null);
          }}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
}

export default DayDetailsPage;
