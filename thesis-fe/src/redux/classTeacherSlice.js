import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const classTeacherActions = {
  getAllClassTeachers: () => async (dispatch) => {
    try {
      const { data } = await api.getAllClassTeachers();

      dispatch(actions.fetchClassTeachers({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  createClassTeacher: (classTeacher, meta) => async (dispatch) => {
    try {
      const { data } = await api.createClassTeacher(classTeacher);

      if (data) {
        dispatch(actions.createClassTeacher({ data }));
        if (meta.onSuccess) meta.onSuccess();
      }
      if (meta.onSuccess) meta.onSuccess();
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  // Lọc danh sách lớp - giảng viên
  changeCurrentClassTeachers: (id) => (dispatch, getState) => {
    const currentClassTeachers = getState().classTeacherReducer.currentClassTeachers;
    const allClassTeachers = getState().classTeacherReducer.allClassTeachers;
    if (
      currentClassTeachers[0]?.teacherId !== id ||
      currentClassTeachers[0]?.classId !== id
    ) {
      const data = allClassTeachers.filter(
        (record) => record.teacherId === id || record.classId === id
      );

      if (data?.length) dispatch(actions.changeCurrentClassTeachers({ data }));
      else {
        console.log('No data found!', id);
        dispatch(actions.changeCurrentClassTeachers({ data: [] }));
      }
    }
  },

  resetCurrentClassTeacher: () => (dispatch) =>
    dispatch(actions.resetCurrentClassTeacher()),
};

const initialState = {
  currentClassTeachers: [],
  allClassTeachers: [],
};

const classTeacherSlice = createSlice({
  name: 'classTeacherReducer',
  initialState,
  reducers: {
    fetchClassTeachers: (state, action) => {
      state.allClassTeachers = action.payload.data;
    },

    createClassTeacher: (state, action) => {
      state.allClassTeachers.push(action.payload.data);
      state.currentClassTeachers.push(action.payload.data);
    },

    changeCurrentClassTeachers: (state, action) => {
      state.currentClassTeachers = [...action.payload.data];
    },

    resetCurrentClassTeacher: (state, action) => {
      state.currentClassTeachers = [];
    },
  },
});

const actions = classTeacherSlice.actions;
export const { reducer } = classTeacherSlice;
