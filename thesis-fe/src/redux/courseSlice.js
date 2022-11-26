/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { changeStringToNormalizeString } from '../components/Common/utilities';

export const courseActions = {
  getCourses: () => async (dispatch) => {
    try {
      const { data } = await api.getCourses();

      dispatch(actions.fetchCourses({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  searchCourse: (str) => (dispatch) => {
    if (!str) dispatch(courseActions.getCourses());

    dispatch(actions.searchCourse({ str: str || '', dispatch }));
  },

  createCourse: (course) => async (dispatch) => {
    try {
      const { data } = await api.createCourse(course);

      dispatch(actions.createClass({ newCourse: data }));
    } catch (error) {
      console.log(error);
    }
  },

  updateCourse: (id, course) => async (dispatch) => {
    try {
      const { data } = await api.updateCourse(id, course);

      dispatch(
        actions.updateCourse({
          id,
          course: data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  deleteCourse: (id) => async (dispatch) => {
    try {
      await api.deleteCourse(id);

      dispatch(actions.deleteCourse({ id }));
    } catch (error) {
      console.log(error);
    }
  },
};

const initialState = {
  courses: [],
  totalCourses: 0,
};

const courseSlice = createSlice({
  name: 'courseReducer',
  initialState,
  reducers: {
    fetchCourses: (state, action) => {
      state.courses = action.payload.data;
      state.totalCourses = Object.keys(action.payload.data)?.length;
    },
    createCourse: (state, action) => {
      state.courses.push(action.payload.newCourse);
    },
    updateCourse: (state, action) => {
      state.courses = state.courses.map((course) =>
        course._id === action.payload.id ? (course = action.payload.course) : course
      );
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload.id
      );
      --state.totalCourses;
    },
    searchCourse: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.courses = state.courses.filter(
          (course) =>
            course._id.includes(str) ||
            changeStringToNormalizeString(course.name).toLowerCase().includes(str)
        );
      }
      state.totalCourses = state.courses.length;
    },
  },
});

const actions = courseSlice.actions;
export const { reducer } = courseSlice;
