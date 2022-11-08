import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const studentActions = {
  getStudents: () => async (dispatch) => {
    try {
      const { data } = await api.getStudents();

      dispatch(actions.fetchStudents({ data }));
    } catch (error) {
      console.log(error);
    }
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

  createStudent: (student) => async (dispatch) => {
    try {
      const { data } = await api.createStudent(student);

      dispatch(actions.createStudent({ newStudent: student }));
    } catch (error) {
      console.log(error);
    }
  },

  updateStudent: (id, student) => async (dispatch) => {
    try {
      const { data } = await api.updateStudent(id, student);

      dispatch(actions.updateStudent({ payload: data, id, student }));
    } catch (error) {
      console.log(error.messsage);
    }
  },

  deleteStudent: (id) => async (dispatch) => {
    try {
      await api.deleteStudent(id);

      dispatch(actions.deleteStudent({ id }));
    } catch (error) {
      console.log(error);
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
    createStudent: (state, action) => {
      state.students.push(action.payload.newStudent);
    },
    updateStudent: (state, action) => {
      state.students.map((student) => {
        if (student.id === action.payload.id) student = action.payload.student;
      });
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