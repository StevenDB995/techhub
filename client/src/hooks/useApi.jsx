import { useContext } from 'react';
import { ApiContext } from '../contexts/ApiProvider';

const useApi = () => useContext(ApiContext);

export default useApi;
