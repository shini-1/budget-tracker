// Custom Hook for Authentication

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  loginUser, 
  loginUserBasic,
  registerUser, 
  logoutUser, 
  loadStoredAuth,
  clearError 
} from '../store/slices/authSlice';
import { LoginForm, RegisterForm } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginForm) => {
    return dispatch(loginUser(credentials));
  };

  const loginBasic = async (credentials: LoginForm) => {
    return dispatch(loginUserBasic(credentials));
  };

  const register = async (userData: RegisterForm) => {
    return dispatch(registerUser(userData));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const loadAuth = async () => {
    return dispatch(loadStoredAuth());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...auth,
    login,
    loginBasic,
    register,
    logout,
    loadAuth,
    clearAuthError,
  };
};
