import { useCallback, useEffect, useMemo, useState } from 'react';
import useApi from './useApi';

// A custom hook for fetching data on page load using GET method
const useFetch = (url, config = undefined) => {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const configString = JSON.stringify(config);
  const memoizedConfig = useMemo(() => config, [configString]);

  const fetchData = useCallback(async (newConfig = memoizedConfig) => {
    setLoading(true);
    try {
      const response = await api.get(url, newConfig);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [api, memoizedConfig, url]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
