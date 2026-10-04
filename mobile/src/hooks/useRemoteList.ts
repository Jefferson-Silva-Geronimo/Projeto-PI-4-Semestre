import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  getApiErrorMessage,
} from '../utils/error';

export function useRemoteList<T>(
  fetcher: () => Promise<T[]>,
  fallbackMessage: string,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(
    async (
      options?: { refreshing?: boolean },
    ): Promise<void> => {
      try {
        if (options?.refreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage('');
        setItems(await fetcher());
      } catch (error: unknown) {
        setErrorMessage(
          getApiErrorMessage(error, fallbackMessage),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetcher, fallbackMessage],
  );

  const refresh = useCallback(
    () => load({ refreshing: true }),
    [load],
  );

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    items,
    loading,
    refreshing,
    errorMessage,
    load,
    refresh,
  };
}
