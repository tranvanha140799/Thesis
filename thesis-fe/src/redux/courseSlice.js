/* eslint-disable array-callback-return */
import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

export const courseAction = {
  getCourses: () => async (dispatch) => {
    try {
      const { data } = await api.getCourses();

      dispatch(actions.fetchCourses({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  createCourse: (course) => async (dispatch) => {
    try {
      // const { data } = await api.createClasses(clasS);

      dispatch(
        actions.createClass({
          newCourse: course,
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  updateCourse: (id, course) => async (dispatch) => {
    try {
      // const { data } = await api.updateClasses(id, clasS);

      dispatch(
        actions.updateCourse({
          id,
          course: course,
        })
      );
    } catch (error) {
      console.log(error.messsage);
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
  name: "classReducer",
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
      state.courses = state.courses.map((course) => {
        if (course.id === action.payload.course.id) course = action.course;
      });
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload.id
      );
      --state.totalCourses;
    },
  },
});

const actions = courseAction.actions;
export const { reducer } = courseSlice;
