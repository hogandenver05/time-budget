import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCategories, createCategory, createPlanEntry, updatePlanEntry, deletePlanEntry } from '../firebase/firestore';
import { getPlanEntries } from '../firebase/firestore';
import { aggregatePlanEntries } from '../utils/aggregation';
import { calculateWeeklySummary } from '../utils/summary';
import { PieChartDay } from '../components/PieChartDay';
import { PlanEntriesList } from '../components/PlanEntriesList';
import { WeeklySummary as WeeklySummaryComponent } from '../components/WeeklySummary';
import { AddEntryWizard, type WizardState } from '../components/AddEntryWizard/AddEntryWizard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Skeleton } from '../components/Skeleton';
import type { Category } from '../types/category';
import type { PlanEntry } from '../types/plan';
import type { DayBreakdown } from '../utils/aggregation';
import type { WeeklySummary } from '../utils/summary';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function WeeklyView() {
  const { user } = useAuth();
  const [categoriesList, setCategoriesList] = useState<(Category & { id: string })[]>([]);
  const [planEntries, setPlanEntries] = useState<(PlanEntry & { id: string })[]>([]);
  const [dayBreakdowns, setDayBreakdowns] = useState<DayBreakdown[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [editingEntry, setEditingEntry] = useState<(PlanEntry & { id: string }) | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch categories and plan entries in parallel
      const [categories, entries] = await Promise.all([
        getCategories(user.uid),
        getPlanEntries(user.uid),
      ]);

      // Convert categories array to Map for efficient lookups
      const categoriesMap = new Map<string, Category & { id: string }>();
      categories.forEach((cat) => {
        categoriesMap.set(cat.id, cat);
      });

      setCategoriesList(categories);
      setPlanEntries(entries);

      // Aggregate plan entries into daily breakdowns
      const breakdowns = aggregatePlanEntries(entries, categoriesMap);
      setDayBreakdowns(breakdowns);

      // Calculate weekly summary
      const summary = calculateWeeklySummary(entries, categoriesMap);
      setWeeklySummary(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };


  const handleWizardComplete = async (wizardState: WizardState) => {
    if (!user) return;

    try {
      setError(null);

      // Step 1: Create category if it's a new one
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
        // Update existing entry
        await updatePlanEntry(user.uid, editingEntry.id, {
          categoryId,
          label: wizardState.label || undefined,
          priority: wizardState.priority!,
          daysOfWeek: wizardState.daysOfWeek,
          minutesPerDay: wizardState.minutesPerDay,
          startTimeLocal: wizardState.startTimeLocal || undefined,
          endTimeLocal: wizardState.endTimeLocal || undefined,
        });
      } else {
        // Create new entry
        await createPlanEntry(user.uid, {
          categoryId,
          label: wizardState.label || undefined,
          priority: wizardState.priority!,
          daysOfWeek: wizardState.daysOfWeek,
          minutesPerDay: wizardState.minutesPerDay,
          startTimeLocal: wizardState.startTimeLocal || undefined,
          endTimeLocal: wizardState.endTimeLocal || undefined,
        });
      }

      // Close wizard and refresh data
      setShowWizard(false);
      setEditingEntry(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || `Failed to ${editingEntry ? 'update' : 'create'} plan entry`);
      throw err; // Re-throw so wizard can handle it
    }
  };

  const handleEditEntry = (entry: PlanEntry & { id: string }) => {
    setEditingEntry(entry);
    setShowWizard(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;

    try {
      setError(null);
      await deletePlanEntry(user.uid, entryId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete entry');
    }
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowWizard(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading your weekly plan...</p>
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
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Weekly Time Budget
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Plan your week and see how your time is allocated
        </p>
      </div>

      {/* Weekly Summary */}
      {weeklySummary && (
        <div>
          <WeeklySummaryComponent summary={weeklySummary} />
        </div>
      )}

      {/* Seven Daily Pie Charts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Daily Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {dayBreakdowns.map((breakdown, index) => (
            <PieChartDay
              key={breakdown.dayOfWeek}
              dayBreakdown={breakdown}
              dayName={DAY_NAMES[index]}
            />
          ))}
        </div>
      </div>

      {/* Plan Entries List */}
      <div>
        <PlanEntriesList
          entries={planEntries}
          categories={new Map(categoriesList.map((cat) => [cat.id, cat]))}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      </div>

      {/* Add to Week Button - FAB on mobile, regular button on desktop */}
      <div className="fixed bottom-6 right-6 sm:static sm:flex sm:justify-center sm:mt-8">
        <button
          onClick={handleAddEntry}
          className="w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add to Week"
        >
          <svg
            className="w-6 h-6 sm:w-5 sm:h-5"
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
          <span className="hidden sm:inline">Add to Week</span>
        </button>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <AddEntryWizard
          categories={categoriesList}
          onClose={() => {
            setShowWizard(false);
            setEditingEntry(null);
          }}
          onComplete={handleWizardComplete}
          initialEntry={editingEntry}
          entryId={editingEntry?.id || null}
        />
      )}
    </div>
  );
}

export default WeeklyView;

