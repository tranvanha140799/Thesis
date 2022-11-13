import { configureStore } from "@reduxjs/toolkit";

import { reducer as authReducer } from "./authSlice";
import { reducer as classesReducer } from "./classSlice";
import { reducer as classStudentReducer } from "./classStudentSlice";
import { reducer as studentsReducer } from "./studentSlice";
import { reducer as teachersReducer } from "./teacherSlice";
import { reducer as courseReducer } from "./courseSlice";

export default configureStore({
  reducer: {
    authReducer,
    teachersReducer,
    studentsReducer,
    classesReducer,
    classStudentReducer,
    courseReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
