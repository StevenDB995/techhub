import { useEffect, useState } from 'react';

// A custom hook for fetching data on page load using GET method
const useFetch = (apiFunc, ...params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await apiFunc(...params);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, setData, loading, error };
};

export default useFetch;
