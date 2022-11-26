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

  createClassStudent: (classStudent, meta) => async (dispatch) => {
    try {
      const { data } = await api.createClassStudent(classStudent);

      if (data) {
        dispatch(actions.createClassStudent({ data }));
        if (meta.onSuccess) meta.onSuccess();
      }
      if (meta.onSuccess) meta.onSuccess();
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  // Lọc danh sách nộp tiền của học viên cụ thể
  changeCurrentClassStudents: (classId, studentId) => (dispatch, getState) => {
    const currentClassStudents = getState().classStudentReducer.currentClassStudents;
    const allClassStudents = getState().classStudentReducer.allClassStudents;
    if (
      currentClassStudents[0]?.class_id !== classId ||
      currentClassStudents[0]?.student_id !== studentId
    ) {
      const data = allClassStudents.filter(
        (record) => record.class_id === classId && record.student_id === studentId
      );

      if (data?.length) {
        dispatch(actions.changeCurrentClassStudents({ data }));

        dispatch(classStudentActions.changeNewestCurrentClassStudent());
      } else {
        console.log('No data found!', classId, studentId);
        dispatch(actions.changeCurrentClassStudents({ data: [] }));
      }
    }
  },

  // Lấy lần nộp tiền mới nhất
  changeNewestCurrentClassStudent: () => (dispatch, getState) => {
    const newestCurrentClassStudent =
      getState().classStudentReducer.newestCurrentClassStudent;
    const currentClassStudents = getState().classStudentReducer.currentClassStudents;
    if (
      newestCurrentClassStudent?.class_id !== currentClassStudents[0]?.class_id ||
      newestCurrentClassStudent?.student_id !== currentClassStudents[0]?.student_id
    ) {
      const max = currentClassStudents
        .map((record) => record.payTime)
        .sort((a, b) => b - a)[0];
      const data = currentClassStudents.filter((record) => record.payTime === max);

      if (data?.length)
        dispatch(actions.changeNewestCurrentClassStudent({ data: data[0] }));
      else {
        console.log('No data found!');
        dispatch(actions.changeNewestCurrentClassStudent({ data: {} }));
      }
    }
  },

  resetCurrentClassStudent: () => (dispatch) =>
    dispatch(actions.resetCurrentClassStudent()),
};

const initialState = {
  currentClassStudents: [],
  newestCurrentClassStudent: {},
  allClassStudents: [],
};

const classStudentSlice = createSlice({
  name: 'classStudentReducer',
  initialState,
  reducers: {
    fetchClassStudents: (state, action) => {
      state.allClassStudents = action.payload.data;
    },

    createClassStudent: (state, action) => {
      state.allClassStudents.push(action.payload.data);
      state.currentClassStudents.push(action.payload.data);
      state.newestCurrentClassStudent = action.payload.data;
    },

    changeCurrentClassStudents: (state, action) => {
      state.currentClassStudents = [...action.payload.data];
    },

    changeNewestCurrentClassStudent: (state, action) => {
      state.newestCurrentClassStudent = { ...action.payload.data };
    },

    resetCurrentClassStudent: (state, action) => {
      state.currentClassStudents = [];
      state.newestCurrentClassStudent = {};
    },
  },
});

const actions = classStudentSlice.actions;
export const { reducer } = classStudentSlice;
