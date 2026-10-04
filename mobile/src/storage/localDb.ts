import * as SQLite from 'expo-sqlite';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null =
  null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(
      'petshop.db',
    ).then(async (database) => {
      await database.execAsync(
        'CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL, updatedAt INTEGER NOT NULL)',
      );

      return database;
    });
  }

  return databasePromise;
}

export const localDb = {
  async set(key: string, value: unknown): Promise<void> {
    try {
      const database = await getDatabase();

      await database.runAsync(
        'INSERT OR REPLACE INTO cache (key, value, updatedAt) VALUES (?, ?, ?)',
        key,
        JSON.stringify(value),
        Date.now(),
      );
    } catch {
      databasePromise = null;
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const database = await getDatabase();

      const row = await database.getFirstAsync<{
        value: string;
      }>('SELECT value FROM cache WHERE key = ?', key);

      return row ? (JSON.parse(row.value) as T) : null;
    } catch {
      databasePromise = null;

      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const database = await getDatabase();

      await database.runAsync(
        'DELETE FROM cache WHERE key = ?',
        key,
      );
    } catch {
      databasePromise = null;
    }
  },
};
