import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Category } from '../types/category';
import type { Activity } from '../types/activity';

// ============================================================================
// Categories
// ============================================================================

/**
 * Get all categories for a user
 */
export async function getCategories(userId: string): Promise<(Category & { id: string })[]> {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const snapshot = await getDocs(categoriesRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Category & { id: string })[];
}

/**
 * Get a single category by ID
 */
export async function getCategory(userId: string, categoryId: string): Promise<Category | null> {
  const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
  const snapshot = await getDoc(categoryRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Category & { id: string };
}

/**
 * Create a new category
 */
export async function createCategory(
  userId: string,
  category: Omit<Category, 'archived'> & { archived?: boolean }
): Promise<string> {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const newCategoryRef = doc(categoriesRef);
  
  const categoryData: Category = {
    name: category.name,
    color: category.color,
    builtIn: category.builtIn ?? false,
    archived: category.archived ?? false,
  };
  
  await setDoc(newCategoryRef, categoryData);
  return newCategoryRef.id;
}

/**
 * Update an existing category
 */
export async function updateCategory(
  userId: string,
  categoryId: string,
  updates: Partial<Category>
): Promise<void> {
  const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
  await updateDoc(categoryRef, updates);
}

/**
 * Delete a category (or archive it)
 */
export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
  await deleteDoc(categoryRef);
}

// ============================================================================
// Plan Entries
// ============================================================================

/**
 * Get all plan entries for a user
 */
export async function getActivities(userId: string): Promise<(Activity & { id: string })[]> {
  const activitiesRef = collection(db, 'users', userId, 'planEntries');
  const snapshot = await getDocs(activitiesRef);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  }) as (Activity & { id: string })[];
}

/**
 * Get a single activity by ID
 */
export async function getActivity(
  userId: string,
  entryId: string
): Promise<(Activity & { id: string }) | null> {
  const entryRef = doc(db, 'users', userId, 'planEntries', entryId);
  const snapshot = await getDoc(entryRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  } as Activity & { id: string };
}

/**
 * Create a new activity
 */
export async function createActivity(
  userId: string,
  entry: Omit<Activity, 'createdAt' | 'updatedAt'>
): Promise<string> {
  const activitiesRef = collection(db, 'users', userId, 'planEntries');
  const newEntryRef = doc(activitiesRef);
  
  const entryData = {
    categoryId: entry.categoryId,
    label: entry.label || null,
    priority: entry.priority,
    daysOfWeek: entry.daysOfWeek,
    minutesPerDay: entry.minutesPerDay,
    startTimeLocal: entry.startTimeLocal || null,
    endTimeLocal: entry.endTimeLocal || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(newEntryRef, entryData);
  return newEntryRef.id;
}

/**
 * Update an existing activity
 */
export async function updateActivity(
  userId: string,
  entryId: string,
  updates: Partial<Omit<Activity, 'createdAt' | 'updatedAt'>> & { updatedAt?: never }
): Promise<void> {
  const entryRef = doc(db, 'users', userId, 'planEntries', entryId);
  const updateData: any = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  
  // Convert null to null explicitly for optional fields
  if ('label' in updates) {
    updateData.label = updates.label || null;
  }
  if ('startTimeLocal' in updates) {
    updateData.startTimeLocal = updates.startTimeLocal || null;
  }
  if ('endTimeLocal' in updates) {
    updateData.endTimeLocal = updates.endTimeLocal || null;
  }
  
  await updateDoc(entryRef, updateData);
}

/**
 * Delete a activity
 */
export async function deleteActivity(userId: string, entryId: string): Promise<void> {
  const entryRef = doc(db, 'users', userId, 'planEntries', entryId);
  await deleteDoc(entryRef);
}

// ============================================================================
// User Data Management
// ============================================================================

/**
 * Delete all user data from Firestore (categories, plan entries, and user document)
 */
export async function deleteUserData(userId: string): Promise<void> {
  // Delete all categories
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const categoriesSnapshot = await getDocs(categoriesRef);
  const categoryDeletes = categoriesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(categoryDeletes);

  // Delete all plan entries
  const activitiesRef = collection(db, 'users', userId, 'planEntries');
  const activitiesSnapshot = await getDocs(activitiesRef);
  const entryDeletes = activitiesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(entryDeletes);

  // Delete user document
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
}

