import { useCallback, useEffect, useState } from 'react';
import useApi from './useApi';

// A custom hook for fetching data on page load using GET method
const useFetch = (url, params) => {
  const { api, apiErrorHandler } = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (newParams = params) => {
    setLoading(true);
    try {
      const response = await api.get(url, { params: newParams });
      setData(response.data);
    } catch (err) {
      apiErrorHandler(err, () => setError(err));
    }
    setLoading(false);
  }, [api, apiErrorHandler, params, url]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
