import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCategories, deletePlanEntry } from '../firebase/firestore';
import { getActivities } from '../firebase/firestore';
import { ActivitiesList } from '../components/ActivitiesList';
import { AddEntryWizard, type WizardState } from '../components/AddEntryWizard/AddEntryWizard';
import { createPlanEntry, updatePlanEntry, createCategory } from '../firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Category } from '../types/category';
import type { PlanEntry } from '../types/plan';

const DAY_ABBREVIATIONS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function ActivitiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<(Category & { id: string })[]>([]);
  const [activities, setActivities] = useState<(PlanEntry & { id: string })[]>([]);
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

      const [categories, entries] = await Promise.all([
        getCategories(user.uid),
        getActivities(user.uid),
      ]);

      setCategoriesList(categories);
      setActivities(entries);
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

      setShowWizard(false);
      setEditingEntry(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || `Failed to ${editingEntry ? 'update' : 'create'} activity`);
      throw err;
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
      setError(err.message || 'Failed to delete activity');
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
        <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
      </div>
    );
  }

  if (error && !activities.length) {
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
            Manage Activities
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

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
        </div>
      )}

      {/* Activities List */}
      <div>
        <ActivitiesList
          entries={activities}
          categories={new Map(categoriesList.map((cat) => [cat.id, cat]))}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
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

export default ActivitiesPage;

