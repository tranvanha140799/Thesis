import { configureStore } from '@reduxjs/toolkit';

import { reducer as authReducer } from './authSlice';
import { reducer as classReducer } from './classSlice';
import { reducer as classStudentReducer } from './classStudentSlice';
import { reducer as classTeacherReducer } from './classTeacherSlice';
import { reducer as courseReducer } from './courseSlice';
import { reducer as exemptReducer } from './exemptSlice';
import { reducer as paySalaryReducer } from './paySalarySlice';
import { reducer as salaryFactorReducer } from './salaryFactorSlice';
import { reducer as scheduleReducer } from './scheduleSlice';
import { reducer as studentReducer } from './studentSlice';
import { reducer as teacherReducer } from './teacherSlice';

export default configureStore({
  reducer: {
    authReducer,
    classReducer,
    classStudentReducer,
    classTeacherReducer,
    courseReducer,
    exemptReducer,
    paySalaryReducer,
    salaryFactorReducer,
    scheduleReducer,
    studentReducer,
    teacherReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
