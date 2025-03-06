import { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import useApiErrorHandler from './useApiErrorHandler';

// A custom hook for fetching data on page load using GET method
const useFetch = (url, params) => {
  const handleApiError = useApiErrorHandler();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (newParams = params) => {
    setLoading(true);
    try {
      const response = await api.get(url, { params: newParams });
      setData(response.data);
    } catch (err) {
      handleApiError(err, () => setError(err));
    }
    setLoading(false);
  }, [handleApiError, params, url]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
