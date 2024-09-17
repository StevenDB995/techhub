import { useEffect, useState } from 'react';


// A custom hook for fetching data on page load using GET method
const useFetch = (apiFunc) => {
  const [responseBody, setResponseBody] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchData = async () => {
    try {
      const response = await apiFunc();
      setResponseBody(response.data);
      setStatus(response.status);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { responseBody, loading, error, status };
};

export default useFetch;
