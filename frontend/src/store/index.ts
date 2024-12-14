import { configureStore } from '@reduxjs/toolkit';
import costReducer from './slices/costSlice';
import recommendationsReducer from './slices/recommendationsSlice';
import resourcesReducer from './slices/resourcesSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cost: costReducer,
    recommendations: recommendationsReducer,
    resources: resourcesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
