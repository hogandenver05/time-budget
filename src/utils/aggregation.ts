import type { PlanEntry } from '../types/plan';
import type { Category } from '../types/category';

/**
 * Represents aggregated time for a category on a specific day
 */
export interface DayCategoryTotal {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  minutes: number;
}

/**
 * Represents the complete breakdown of a day (24 hours = 1440 minutes)
 */
export interface DayBreakdown {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  categoryTotals: DayCategoryTotal[];
  freeTimeMinutes: number; // Remaining time after all planned activities
}

/**
 * Aggregate plan entries into daily totals by category
 * 
 * @param planEntries - Array of plan entries
 * @param categories - Map of categoryId to Category for lookups
 * @returns Array of day breakdowns (one for each day of the week)
 */
export function aggregatePlanEntries(
  planEntries: (PlanEntry & { id: string })[],
  categories: Map<string, Category & { id: string }>
): DayBreakdown[] {
  // Initialize breakdowns for all 7 days
  const dayBreakdowns: DayBreakdown[] = [];
  for (let day = 0; day < 7; day++) {
    dayBreakdowns.push({
      dayOfWeek: day,
      categoryTotals: [],
      freeTimeMinutes: 1440, // Start with full 24 hours
    });
  }

  // Track minutes per category per day
  const dayCategoryMinutes: Map<number, Map<string, number>> = new Map();
  for (let day = 0; day < 7; day++) {
    dayCategoryMinutes.set(day, new Map());
  }

  // Process each plan entry
  for (const entry of planEntries) {
    const category = categories.get(entry.categoryId);
    if (!category) {
      // Skip entries with missing categories
      continue;
    }

    // For each day this entry applies to
    for (const dayOfWeek of entry.daysOfWeek) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        continue; // Skip invalid days
      }

      const dayMap = dayCategoryMinutes.get(dayOfWeek);
      if (!dayMap) {
        continue;
      }

      // Add minutes for this category on this day
      const currentMinutes = dayMap.get(entry.categoryId) || 0;
      dayMap.set(entry.categoryId, currentMinutes + entry.minutesPerDay);
    }
  }

  // Build category totals for each day
  for (let day = 0; day < 7; day++) {
    const dayMap = dayCategoryMinutes.get(day);
    if (!dayMap) {
      continue;
    }

    const categoryTotals: DayCategoryTotal[] = [];
    let totalPlannedMinutes = 0;

    // Convert map entries to category totals
    for (const [categoryId, minutes] of dayMap.entries()) {
      const category = categories.get(categoryId);
      if (!category) {
        continue;
      }

      categoryTotals.push({
        categoryId,
        categoryName: category.name,
        categoryColor: category.color,
        minutes,
      });

      totalPlannedMinutes += minutes;
    }

    // Sort by minutes descending
    categoryTotals.sort((a, b) => b.minutes - a.minutes);

    // Calculate free time (1440 minutes = 24 hours)
    const freeTimeMinutes = Math.max(0, 1440 - totalPlannedMinutes);

    // Add free time as a category if there's any
    if (freeTimeMinutes > 0) {
      categoryTotals.push({
        categoryId: 'free-time',
        categoryName: 'Free time',
        categoryColor: '#e5e7eb', // Light gray
        minutes: freeTimeMinutes,
      });
    }

    dayBreakdowns[day].categoryTotals = categoryTotals;
    dayBreakdowns[day].freeTimeMinutes = freeTimeMinutes;
  }

  return dayBreakdowns;
}

