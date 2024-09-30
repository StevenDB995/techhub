import { useCallback, useEffect, useState } from 'react';
import useAxios from './useAxios';

// A custom hook for fetching data on page load using GET method
const useFetch = (url, config = undefined) => {
  const axios = useAxios();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (newConfig = config) => {
    setLoading(true);
    try {
      const response = await axios.get(url, newConfig);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
