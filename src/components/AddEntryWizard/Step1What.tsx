import { useState } from 'react';
import type { Category } from '../../types/category';
import type { WizardState } from './AddEntryWizard';

interface Step1WhatProps {
  categories: (Category & { id: string })[];
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
}

export function Step1What({ categories, state, updateState }: Step1WhatProps) {
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCategorySelect = (categoryId: string) => {
    updateState({
      categoryId,
      categoryName: null, // Clear new category name if selecting existing
    });
    setShowCreateCategory(false);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      updateState({
        categoryId: null, // Clear selected category
        categoryName: newCategoryName.trim(),
      });
    }
  };

  const activeCategories = categories.filter((cat) => !cat.archived);

  return (
    <div className="pb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">What activity?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose a category or create your own. You can add an optional label like "Guitar" under Hobby.
      </p>

      {/* Category selection grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {activeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              state.categoryId === category.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-105'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div
              className="w-10 h-10 rounded-full shadow-sm"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Create custom category */}
      <div className="mb-6">
        {!showCreateCategory ? (
          <button
            onClick={() => setShowCreateCategory(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium"
          >
            + Create Custom Category
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <input
              type="color"
              value={state.categoryColor}
              onChange={(e) => updateState({ categoryColor: e.target.value })}
              className="w-14 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                newCategoryName.trim()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateCategory(false);
                setNewCategoryName('');
              }}
              className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Optional label input */}
      <div>
        <label
          htmlFor="label"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Optional Label (e.g., "Guitar", "Morning Run")
        </label>
        <input
          id="label"
          type="text"
          value={state.label}
          onChange={(e) => updateState({ label: e.target.value })}
          placeholder="Add a specific label..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
}

