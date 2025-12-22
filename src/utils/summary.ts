import type { Activity } from '../types/activity';
import type { Category } from '../types/category';

export interface WeeklySummary {
  totalNeedHours: number;
  totalWantHours: number;
  totalFreeTimeHours: number;
  freeTimePercentage: number;
  biggestCategory: {
    name: string;
    color: string;
    hours: number;
  } | null;
}

/**
 * Calculate weekly summary statistics from plan entries
 * 
 * @param activities - Array of plan entries for the week
 * @param categories - Map of categoryId to Category for lookups
 * @returns Weekly summary statistics
 */
export function calculateWeeklySummary(
  activities: (Activity & { id: string })[],
  categories: Map<string, Category & { id: string }>
): WeeklySummary {
  const TOTAL_WEEKLY_MINUTES = 7 * 24 * 60; // 7 days * 24 hours * 60 minutes = 10,080 minutes

  let totalNeedMinutes = 0;
  let totalWantMinutes = 0;
  const categoryMinutes = new Map<string, number>();

  // Process each activity
  for (const entry of activities) {
    const category = categories.get(entry.categoryId);
    if (!category) {
      continue; // Skip entries with missing categories
    }

    // Calculate total minutes for this entry across all days
    const entryTotalMinutes = entry.minutesPerDay * entry.daysOfWeek.length;

    // Add to priority totals
    if (entry.priority === 'need') {
      totalNeedMinutes += entryTotalMinutes;
    } else {
      totalWantMinutes += entryTotalMinutes;
    }

    // Track category totals
    const currentCategoryMinutes = categoryMinutes.get(entry.categoryId) || 0;
    categoryMinutes.set(entry.categoryId, currentCategoryMinutes + entryTotalMinutes);
  }

  // Find biggest category
  let biggestCategory: { name: string; color: string; hours: number } | null = null;
  let maxMinutes = 0;

  for (const [categoryId, minutes] of categoryMinutes.entries()) {
    if (minutes > maxMinutes) {
      const category = categories.get(categoryId);
      if (category) {
        maxMinutes = minutes;
        biggestCategory = {
          name: category.name,
          color: category.color,
          hours: minutes / 60,
        };
      }
    }
  }

  // Calculate free time
  const totalPlannedMinutes = totalNeedMinutes + totalWantMinutes;
  const totalFreeTimeMinutes = Math.max(0, TOTAL_WEEKLY_MINUTES - totalPlannedMinutes);
  const freeTimePercentage = (totalFreeTimeMinutes / TOTAL_WEEKLY_MINUTES) * 100;

  return {
    totalNeedHours: totalNeedMinutes / 60,
    totalWantHours: totalWantMinutes / 60,
    totalFreeTimeHours: totalFreeTimeMinutes / 60,
    freeTimePercentage,
    biggestCategory,
  };
}

