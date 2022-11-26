import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { changeStringToNormalizeString } from '../components/Common/utilities';

export const teacherActions = {
  getTeachers: () => async (dispatch) => {
    try {
      const { data } = await api.getTeachers();

      dispatch(actions.fetchTeachers({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  searchTeacher: (str) => (dispatch) => {
    if (!str) dispatch(teacherActions.getTeachers());

    dispatch(actions.searchTeacher({ str: str || '', dispatch }));
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

  createTeacher: (teacher, meta) => async (dispatch) => {
    try {
      const response = await api.createTeacher(teacher);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.createTeacher({ newTeacher: response.data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  updateTeacher: (id, teacher, meta) => async (dispatch) => {
    try {
      const response = await api.updateTeacher(id, teacher);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.updateTeacher({ id, teacher: response.data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  deleteTeacher: (id, meta) => async (dispatch) => {
    try {
      const response = await api.deleteTeacher(id);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.deleteTeacher({ id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
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
      ++state.totalTeachers;
    },
    updateTeacher: (state, action) => {
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload.id
          ? (teacher = action.payload.teacher)
          : teacher
      );
    },
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher._id !== action.payload.id
      );
      --state.totalTeachers;
    },
    searchTeacher: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.teachers = state.teachers.filter(
          (teacher) =>
            teacher.teacherId.includes(str) ||
            changeStringToNormalizeString(teacher.fullname).toLowerCase().includes(str)
        );
      }
      state.totalTeachers = state.teachers.length;
    },
  },
});

const actions = teacherSlice.actions;
export const { reducer } = teacherSlice;
