/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const scheduleActions = {
  getSchedules: () => async (dispatch) => {
    try {
      const { data } = await api.getSchedules();

      dispatch(actions.fetchSchedule({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  // getSchedulesBySearch: (searchQuery) => async (dispatch) => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await api.fetchSchedulesBySearch(searchQuery);

  //     dispatch({ type: actionTypes.FETCH_BY_SEARCH, payload: data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  createSchedule: (schedule, meta) => async (dispatch) => {
    try {
      const response = await api.createSchedule(schedule);
      if (response.status === 200 || response.status === 201) {
        dispatch(
          actions.createSchedule({
            newSchedule: schedule,
          })
        );
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  updateSchedule: (id, schedule, meta) => async (dispatch) => {
    try {
      const response = await api.updateSchedule(id, schedule);
      if (response.status === 200 || response.status === 201) {
        dispatch(actions.updateSchedule({ data: response.data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  deleteSchedule: (id, meta) => async (dispatch) => {
    try {
      const response = await api.deleteSchedule(id);
      if (response.status === 200 || response.status === 201) {
        dispatch(actions.deleteSchedule({ id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },
};

const initialState = {
  schedules: [],
  totalSchedules: 0,
};

const scheduleSlice = createSlice({
  name: 'scheduleReducer',
  initialState,
  reducers: {
    fetchSchedule: (state, action) => {
      state.schedules = action.payload.data;
      state.totalSchedules = Object.keys(action.payload.data)?.length;
    },
    createSchedule: (state, action) => {
      state.schedules.push(action.payload.newSchedule);
    },
    updateSchedule: (state, action) => {
      state.schedules = state.schedules.map((schedule) =>
        schedule._id === action.payload.data._id
          ? (schedule = action.payload.data)
          : schedule
      );
    },
    deleteSchedule: (state, action) => {
      state.schedules = state.schedules.filter(
        (schedule) => schedule._id !== action.payload.id
      );
      --state.totalSchedules;
    },
  },
});

const actions = scheduleSlice.actions;
export const { reducer } = scheduleSlice;
