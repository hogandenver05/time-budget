/**
 * Verification utility to test Firebase connection
 * This can be imported and called to verify setup
 */
import { auth, db } from './config';

export async function verifyFirebaseConnection() {
  const results = {
    config: false,
    auth: false,
    firestore: false,
    errors: [] as string[],
  };

  try {
    // Verify config is loaded
    if (auth && db) {
      results.config = true;
    } else {
      results.errors.push('Firebase config not initialized');
    }
  } catch (error: any) {
    results.errors.push(`Config error: ${error.message}`);
  }

  try {
    // Verify Auth is accessible
    if (auth.app) {
      results.auth = true;
    } else {
      results.errors.push('Auth service not accessible');
    }
  } catch (error: any) {
    results.errors.push(`Auth error: ${error.message}`);
  }

  try {
    // Try to access Firestore (this will fail if not properly configured)
    // We'll just check if the service is initialized, not actually query
    if (db.app) {
      results.firestore = true;
    } else {
      results.errors.push('Firestore service not accessible');
    }
  } catch (error: any) {
    results.errors.push(`Firestore error: ${error.message}`);
  }

  return results;
}

