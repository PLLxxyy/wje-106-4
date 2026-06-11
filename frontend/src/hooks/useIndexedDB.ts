import { useCallback, useState } from 'react';
import type { Table } from 'dexie';
import { notifyError } from '../utils/errorBus';

type Entity = { id: string };

export const useIndexedDB = <T extends Entity>(table: Table<T, string>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await table.toArray();
      setData(result);
      setError(null);
      return result;
    } catch {
      const message = '本地数据读取失败。';
      setError(message);
      notifyError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [table]);

  const add = useCallback(
    async (item: T) => {
      await table.put(item);
      await getAll();
    },
    [getAll, table],
  );

  const update = useCallback(
    async (id: string, changes: Partial<T>) => {
      const existing = await table.get(id);
      if (existing) {
        await table.put({ ...existing, ...changes });
      }
      await getAll();
    },
    [getAll, table],
  );

  const remove = useCallback(
    async (id: string) => {
      await table.delete(id);
      await getAll();
    },
    [getAll, table],
  );

  const getById = useCallback((id: string) => table.get(id), [table]);

  return { data, loading, error, add, update, remove, getById, getAll };
};
