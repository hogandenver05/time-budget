import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCategories, createCategory } from '../firebase/firestore';
import type { Category } from '../types/category';

export function CategoriesList() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<(Category & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const categories = await getCategories(user.uid);
      setCategories(categories);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCategoryName.trim()) return;

    try {
      setError(null);
      await createCategory(user.uid, {
        name: newCategoryName.trim(),
        color: newCategoryColor,
        builtIn: false,
      });
      setNewCategoryName('');
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '2rem' }}>
      <h2>Categories</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h3>Existing Categories ({categories.length})</h3>
        {categories.length === 0 ? (
          <p>No categories found. Default categories should be seeded on sign up.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map((cat) => (
              <li
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: cat.color,
                  }}
                />
                <span>{cat.name}</span>
                {cat.builtIn && (
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>(built-in)</span>
                )}
                {cat.archived && (
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>(archived)</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleCreateCategory} style={{ marginTop: '1rem' }}>
        <h3>Create Custom Category</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            required
            style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            style={{ width: '60px', height: '38px' }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

