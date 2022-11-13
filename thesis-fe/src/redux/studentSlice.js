/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { changeStringToNormalizeString } from '../components/Common/utilities';

export const studentActions = {
  getStudents: () => async (dispatch) => {
    try {
      const { data } = await api.getStudents();

      dispatch(actions.fetchStudents({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  searchStudent: (str) => (dispatch) => {
    if (!str) dispatch(studentActions.getStudents());

    dispatch(actions.searchStudent({ str: str || '', dispatch }));
  },

  // getStudentsBySearch: (searchQuery) => async (dispatch) => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await api.fetchStudentsBySearch(searchQuery);

  //     dispatch({ type: actionTypes.FETCH_BY_SEARCH, payload: data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  createStudent: (student, meta) => async (dispatch) => {
    try {
      const response = await api.createStudent(student);
      if (response.status === 200 || response.status === 201) {
        dispatch(actions.createStudent({ newStudent: response.data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  updateStudent: (id, student, meta) => async (dispatch) => {
    try {
      const response = await api.updateStudent(id, student);
      if (response.status === 200 || response.status === 201) {
        dispatch(actions.updateStudent({ data: response.data, id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  deleteStudent: (id, meta) => async (dispatch) => {
    try {
      const response = await api.deleteStudent(id);
      if (response.status === 200 || response.status === 201) {
        dispatch(actions.deleteStudent({ id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },
};

const initialState = {
  students: [],
  totalStudents: 0,
};

const studentSlice = createSlice({
  name: 'studentReducer',
  initialState,
  reducers: {
    fetchStudents: (state, action) => {
      state.students = action.payload.data;
      state.totalStudents = Object.keys(action.payload.data)?.length;
    },
    searchStudent: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.students = state.students.filter(
          (student) =>
            student.studentId.includes(str) ||
            changeStringToNormalizeString(student.fullname).toLowerCase().includes(str)
        );
      }
      state.totalStudents = state.students.length;
    },
    createStudent: (state, action) => {
      state.students.push(action.payload.newStudent);
      state.totalStudents = state.totalStudents + 1;
    },
    updateStudent: (state, action) => {
      state.students = state.students.map((student) =>
        student._id === action.payload.id ? (student = action.payload.data) : student
      );
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        (student) => student._id !== action.payload.id
      );
      --state.totalStudents;
    },
  },
});

const actions = studentSlice.actions;
export const { reducer } = studentSlice;
