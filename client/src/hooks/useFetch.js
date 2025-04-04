import api from '@/api/api';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import deepEqual from 'deep-equal';
import { useCallback, useEffect, useRef, useState } from 'react';

// A custom hook for fetching data on page load using GET method
const useFetch = (url, params = {}) => {
  const handleApiError = useApiErrorHandler();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // keep track of the previous params to detect params change
  const prevParamsRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(url, { params });
      setData(response.data);
    } catch (err) {
      handleApiError(err, () => setError(err));
    }
    setLoading(false);
  }, [params, handleApiError, url]);

  useEffect(() => {
    if (!deepEqual(params, prevParamsRef.current)) {
      // fetchData will only run on params change
      void fetchData();
      prevParamsRef.current = params;
    }
  }, [fetchData, params]);

  return { data, loading, error };
};

export default useFetch;
