import { configureStore } from "@reduxjs/toolkit";

import { reducer as authReducer } from './authSlice';
import { reducer as classesReducer } from './classSlice';
import { reducer as classStudentReducer } from './classStudentSlice';
import { reducer as studentsReducer } from './studentSlice';
import { reducer as teachersReducer } from './teacherSlice';

export default configureStore({
  reducer: {
    authReducer,
    classReducer,
    classStudentReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
