import { useCallback, useEffect, useState } from 'react';

// A custom hook for fetching data on page load using GET method
const useFetch = (apiFunc, ...params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFunc(...params);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunc]);

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, setData, loading, error, refetch: fetchData };
};

export default useFetch;
