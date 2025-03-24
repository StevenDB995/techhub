import { AuthContext } from '@/contexts/AuthProvider';
import { useContext } from 'react';

const useAuth = () => useContext(AuthContext);

export default useAuth;
