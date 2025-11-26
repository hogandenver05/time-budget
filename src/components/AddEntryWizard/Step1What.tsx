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
    <div>
      <h2 style={{ marginTop: 0 }}>What activity?</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Choose a category or create your own. You can add an optional label like "Guitar" under Hobby.
      </p>

      {/* Category selection grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {activeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            style={{
              padding: '1rem',
              border: state.categoryId === category.id ? '2px solid #007bff' : '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: state.categoryId === category.id ? '#f0f8ff' : 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: category.color,
              }}
            />
            <span style={{ fontSize: '0.875rem' }}>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Create custom category */}
      <div style={{ marginBottom: '1.5rem' }}>
        {!showCreateCategory ? (
          <button
            onClick={() => setShowCreateCategory(true)}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px dashed #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            + Create Custom Category
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
              autoFocus
            />
            <input
              type="color"
              value={state.categoryColor}
              onChange={(e) => updateState({ categoryColor: e.target.value })}
              style={{ width: '60px', height: '48px' }}
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: newCategoryName.trim() ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newCategoryName.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateCategory(false);
                setNewCategoryName('');
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Optional label input */}
      <div>
        <label htmlFor="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Optional Label (e.g., "Guitar", "Morning Run")
        </label>
        <input
          id="label"
          type="text"
          value={state.label}
          onChange={(e) => updateState({ label: e.target.value })}
          placeholder="Add a specific label..."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        />
      </div>
    </div>
  );
}

