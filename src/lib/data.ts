import { MockDatabaseService } from '../services/mock-database.service';
import type { DatabaseService } from '../services/database.interface';

/**
 * Database instance
 * 
 * To switch to a real database:
 * 1. Create a new service that implements DatabaseService interface
 * 2. Replace MockDatabaseService with your implementation
 * 3. Add your database connection configuration
 * 
 * Example:
 * import { PrismaDatabaseService } from '../services/prisma-database.service';
 * export const db: DatabaseService = new PrismaDatabaseService(connectionString);
 */
export const db: DatabaseService = new MockDatabaseService();
