import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const classStudentActions = {
  getAllClassStudents: () => async (dispatch) => {
    try {
      const { data } = await api.getAllClassStudents();

      dispatch(actions.fetchClassStudents({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  changeCurrentClassStudent: (classId, studentId) => (dispatch, getState) => {
    const currentClassStudent = getState().classStudentReducer.currentClassStudent;
    const allClassStudents = getState().classStudentReducer.allClassStudents;
    if (
      currentClassStudent?.class_id !== classId ||
      currentClassStudent?.student_id !== studentId
    ) {
      const data = allClassStudents.filter(
        (record) => record.class_id === classId && record.student_id === studentId
      );

      if (data?.length) dispatch(actions.changeCurrentClassStudent({ data: data[0] }));
      else {
        console.log('No data found!', classId, studentId);
        dispatch(actions.changeCurrentClassStudent({ data: {} }));
      }
    }
  },
};

const initialState = {
  currentClassStudent: {},
  allClassStudents: [],
};

const classStudentSlice = createSlice({
  name: 'classStudentReducer',
  initialState,
  reducers: {
    fetchClassStudents: (state, action) => {
      state.allClassStudents = action.payload.data;
    },

    changeCurrentClassStudent: (state, action) => {
      state.currentClassStudent = { ...action.payload.data };
    },
  },
});

const actions = classStudentSlice.actions;
export const { reducer } = classStudentSlice;
