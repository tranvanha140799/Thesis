import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../reducers/auth';
import { reducer as classesReducer } from './classSlice';
import { reducer as studentsReducer } from './studentSlice';
import { reducer as teachersReducer } from './teacherSlice';

export default configureStore({
  reducer: {
    authReducer,
    teachersReducer,
    studentsReducer,
    classesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
