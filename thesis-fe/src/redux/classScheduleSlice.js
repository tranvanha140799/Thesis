import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const classScheduleActions = {
  getAllClassSchedules: () => async (dispatch) => {
    try {
      const { data } = await api.getAllClassSchedules();

      dispatch(actions.fetchClassSchedules({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  createClassSchedule: (classSchedule, meta) => async (dispatch) => {
    try {
      const { data } = await api.createClassSchedule(classSchedule);

      if (data) {
        dispatch(actions.createClassSchedule({ data }));
        if (meta.onSuccess) meta.onSuccess();
      }
      if (meta.onSuccess) meta.onSuccess();
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  // Lọc danh sách khung giờ học của lớp học
  changeCurrentClassSchedules: (classId) => (dispatch, getState) => {
    const currentClassSchedules =
      getState().classScheduleReducer.currentClassSchedules;
    const allClassSchedules = getState().classScheduleReducer.allClassSchedules;
    if (currentClassSchedules[0]?.class_id !== classId) {
      const data = allClassSchedules.filter((record) => record.class_id === classId);

      if (data?.length) dispatch(actions.changeCurrentClassSchedules({ data }));
      else {
        console.log('No data found!', classId);
        dispatch(actions.changeCurrentClassSchedules({ data: [] }));
      }
    }
  },

  resetCurrentClassSchedule: () => (dispatch) =>
    dispatch(actions.resetCurrentClassSchedule()),
};

const initialState = {
  currentClassSchedules: [],
  allClassSchedules: [],
};

const classScheduleSlice = createSlice({
  name: 'classScheduleReducer',
  initialState,
  reducers: {
    fetchClassSchedules: (state, action) => {
      state.allClassSchedules = action.payload.data;
    },

    createClassSchedule: (state, action) => {
      state.allClassSchedules.push(action.payload.data);
      state.currentClassSchedules.push(action.payload.data);
    },

    changeCurrentClassSchedules: (state, action) => {
      state.currentClassSchedules = [...action.payload.data];
    },

    resetCurrentClassSchedule: (state, action) => {
      state.currentClassSchedules = [];
    },
  },
});

const actions = classScheduleSlice.actions;
export const { reducer } = classScheduleSlice;
