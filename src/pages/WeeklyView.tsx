import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../firebase/auth';
import { getCategories, createCategory, createPlanEntry } from '../firebase/firestore';
import { getPlanEntries } from '../firebase/firestore';
import { aggregatePlanEntries } from '../utils/aggregation';
import { PieChartDay } from '../components/PieChartDay';
import { AddEntryWizard, type WizardState } from '../components/AddEntryWizard/AddEntryWizard';
import type { Category } from '../types/category';
import type { PlanEntry } from '../types/plan';
import type { DayBreakdown } from '../utils/aggregation';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function WeeklyView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setCategories] = useState<Map<string, Category & { id: string }>>(new Map());
  const [categoriesList, setCategoriesList] = useState<(Category & { id: string })[]>([]);
  const [, setPlanEntries] = useState<(PlanEntry & { id: string })[]>([]);
  const [dayBreakdowns, setDayBreakdowns] = useState<DayBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

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
      const [cats, entries] = await Promise.all([
        getCategories(user.uid),
        getPlanEntries(user.uid),
      ]);

      // Convert categories array to Map for efficient lookups
      const categoriesMap = new Map<string, Category & { id: string }>();
      cats.forEach((cat) => {
        categoriesMap.set(cat.id, cat);
      });

      setCategories(categoriesMap);
      setCategoriesList(cats);
      setPlanEntries(entries);

      // Aggregate plan entries into daily breakdowns
      const breakdowns = aggregatePlanEntries(entries, categoriesMap);
      setDayBreakdowns(breakdowns);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
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

      // Step 2: Create plan entry
      await createPlanEntry(user.uid, {
        categoryId,
        label: wizardState.label || undefined,
        priority: wizardState.priority!,
        daysOfWeek: wizardState.daysOfWeek,
        minutesPerDay: wizardState.minutesPerDay,
        startTimeLocal: wizardState.startTimeLocal || undefined,
        endTimeLocal: wizardState.endTimeLocal || undefined,
      });

      // Close wizard and refresh data
      setShowWizard(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create plan entry');
      throw err; // Re-throw so wizard can handle it
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading your weekly plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Weekly Time Budget</h1>
          {user && (
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              Welcome, {user.displayName || user.email}!
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {/* Summary Placeholder */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Week Summary</h2>
        <p style={{ margin: 0, color: '#666' }}>
          Summary statistics will appear here (total hours by Need vs Want, biggest category, total free time)
        </p>
      </div>

      {/* Seven Daily Pie Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {dayBreakdowns.map((breakdown, index) => (
          <PieChartDay
            key={breakdown.dayOfWeek}
            dayBreakdown={breakdown}
            dayName={DAY_NAMES[index]}
          />
        ))}
      </div>

      {/* Add to Week Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => setShowWizard(true)}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add to Week
        </button>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <AddEntryWizard
          categories={categoriesList}
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
}

export default WeeklyView;

