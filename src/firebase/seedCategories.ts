import { createCategory } from './firestore';
import type { Category } from '../types/category';

/**
 * Default categories to seed for new users
 */
const DEFAULT_CATEGORIES: Omit<Category, 'archived'>[] = [
  { name: 'Sleep', color: '#6366f1', builtIn: true },
  { name: 'Work', color: '#3b82f6', builtIn: true },
  { name: 'School', color: '#e0e000ff', builtIn: true },
  { name: 'Meals', color: '#10b981', builtIn: true },
  { name: 'Chores', color: '#f59e0b', builtIn: true },
  { name: 'Exercise', color: '#ef4444', builtIn: true },
  { name: 'Community', color: '#8b5cf6', builtIn: true },
  { name: 'Hobbies', color: '#ec4899', builtIn: true },
  { name: 'Relationships', color: '#14b8a6', builtIn: true },
];

/**
 * Seed default categories for a new user
 */
export async function seedDefaultCategories(userId: string): Promise<void> {
  // Create all default categories
  await Promise.all(
    DEFAULT_CATEGORIES.map((category) => createCategory(userId, category))
  );
}

