import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    companyName: string;
    plan: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isAuthenticated = true;
      state.user = {
        email: 'test@example.com',
        companyName: 'Test Company',
        plan: 'Free'
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginUser, logout } = authSlice.actions;
export default authSlice.reducer;
