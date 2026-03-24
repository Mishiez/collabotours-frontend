import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/business/dashboard');
    } else {
      setLocalError(result.error || 'Login failed. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-[#003D5B] to-[#30638E] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#003D5B]">CollaboTours</h1>
          <p className="text-gray-400 mt-2">Business Dashboard Login</p>
        </div>
        
        {localError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {localError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003D5B]"
              >
                {showPassword ? '👁️' : '👁️'}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Demo credentials:</p>
          <p className="mt-1">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">safari_kenya</span> / 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-1">password123</span>
          </p>
          <p className="mt-1">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">beach_paradise</span> / 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-1">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}