import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { storeTokens } from '@/utils/authUtils';
import { toast } from 'sonner';
import { useAppStore } from '@/store/store';
import axiosInstance from '@/utils/axiosConfig';
import { HOST, GETUSER_ROUTE } from '@/utils/constants';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppStore();

  useEffect(() => {
    // Define an async function inside useEffect
    const handleAuth = async () => {
      // Parse query parameters from the URL
      const params = new URLSearchParams(location.search);
      const authToken = params.get('authToken');
      const refreshToken = params.get('refreshToken');

      if (authToken && refreshToken) {
        // Store tokens in localStorage
        storeTokens(authToken, refreshToken);

        // Fetch user data to set in the global store
        try {
          const response = await axiosInstance.get(`${HOST}/${GETUSER_ROUTE}`);
          if (response.status === 200) {
            setUser(response.data);
          }

          toast.success('Successfully logged in!', { theme: 'light' });

          // Redirect to chat page
          setTimeout(() => {
            navigate('/chat');
          }, 1000);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.success('Logged in, loading your profile...', { theme: 'light' });
          navigate('/chat');
        }
      } else {
        toast.error('Authentication failed', { theme: 'light' });
        navigate('/');
      }
    };

    // Call the async function
    handleAuth();
  }, [location, navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="text-center">
        <h2 className="text-base sm:text-lg font-light text-white mb-4">Completing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
