import { configureStore } from '@reduxjs/toolkit';

import { reducer as authReducer } from './authSlice';
import { reducer as classReducer } from './classSlice';
import { reducer as classStudentReducer } from './classStudentSlice';
import { reducer as scheduleReducer } from './scheduleSlice';
import { reducer as studentReducer } from './studentSlice';
import { reducer as teacherReducer } from './teacherSlice';

export default configureStore({
  reducer: {
    authReducer,
    classReducer,
    classStudentReducer,
    scheduleReducer,
    studentReducer,
    teacherReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
