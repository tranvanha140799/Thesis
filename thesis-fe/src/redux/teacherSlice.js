import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const teacherActions = {
  getTeachers: () => async (dispatch) => {
    try {
      const { data } = await api.getTeachers();

      dispatch(actions.fetchTeachers({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  // getTeachersBySearch: (searchQuery) => async (dispatch) => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await api.fetchTeachersBySearch(searchQuery);

  //     dispatch({payload: data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  createTeacher: (teacher) => async (dispatch) => {
    try {
      const { data } = await api.createTeacher(teacher);

      dispatch(
        actions.createTeacher({
          payload: data,
          newTeacher: teacher,
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  updateTeacher: (id, teacher) => async (dispatch) => {
    try {
      const { data } = await api.updateTeacher(id, teacher);

      dispatch(actions.updateTeacher({ payload: data, id, teacher }));
    } catch (error) {
      console.log(error.messsage);
    }
  },

  deleteTeacher: (id) => async (dispatch) => {
    try {
      await api.deleteTeacher(id);

      dispatch(actions.deleteTeacher({ id }));
    } catch (error) {
      console.log(error);
    }
  },
};

const initialState = {
  teachers: [],
  totalTeachers: 0,
};

const teacherSlice = createSlice({
  name: 'teacherReducer',
  initialState,
  reducers: {
    fetchTeachers: (state, action) => {
      state.teachers = action.payload.data;
      state.totalTeachers = Object.keys(action.payload.data)?.length;
    },
    createTeacher: (state, action) => {
      state.teachers.push(action.payload.newTeacher);
    },
    updateTeacher: (state, action) => {
      state.teachers.map((teacher) => {
        if (teacher.id === action.payload.id) teacher = action.payload.teacher;
      });
    },
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher._id !== action.payload.id
      );
      --state.totalTeachers;
    },
  },
});

const actions = teacherSlice.actions;
export const { reducer } = teacherSlice;
