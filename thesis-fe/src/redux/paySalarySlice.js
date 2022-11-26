import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const paySalaryActions = {
  getAllPaySalaries: () => async (dispatch) => {
    try {
      const { data } = await api.getAllPaySalaries();

      dispatch(actions.fetchPaySalaries({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  createPaySalary: (paySalary, meta) => async (dispatch) => {
    try {
      const { data } = await api.createPaySalary(paySalary);

      if (data) {
        dispatch(actions.createPaySalary({ data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError();
    }
  },

  // Lọc danh sách thanh toán lương của giảng viên cụ thể
  changeCurrentPaySalaries: (teacherId) => (dispatch, getState) => {
    const currentPaySalaries = getState().paySalaryReducer.currentPaySalaries;
    const allPaySalaries = getState().paySalaryReducer.allPaySalaries;
    if (currentPaySalaries[0]?.teacherId !== teacherId) {
      const data = allPaySalaries.filter((record) => record.teacherId === teacherId);

      if (!data.length) console.log('No data found!', teacherId);

      dispatch(actions.changeCurrentPaySalaries({ data }));
      dispatch(paySalaryActions.changeLatestCurrentPaySalary());
    }
  },

  // Lấy lần ứng lương mới nhất
  changeLatestCurrentPaySalary: () => (dispatch, getState) => {
    const latestPaySalaryTime = getState().paySalaryReducer.latestPaySalaryTime;
    const currentPaySalaries = getState().paySalaryReducer.currentPaySalaries;
    if (latestPaySalaryTime?.teacherId !== currentPaySalaries[0]?.teacherId) {
      let data = currentPaySalaries[0];
      for (let i = 0; i < currentPaySalaries.length; i++) {
        if (
          new Date(currentPaySalaries[i]?.datePaidSalary) >
            new Date(data?.datePaidSalary) &&
          !currentPaySalaries[i].isPaidSalary
        )
          data = currentPaySalaries[i];
      }

      if (data?._id) dispatch(actions.changeLatestCurrentPaySalary({ data }));
      else {
        console.log('No data found!');
        dispatch(actions.changeLatestCurrentPaySalary({ data: {} }));
      }

      dispatch(paySalaryActions.changeLatestPaidSalary());
    }
  },

  // Lấy lần lĩnh lương mới nhất (ko tính ứng lương)
  changeLatestPaidSalary: () => (dispatch, getState) => {
    const latestPaidSalary = getState().paySalaryReducer.latestPaidSalary;
    const currentPaySalaries = getState().paySalaryReducer.currentPaySalaries;
    if (latestPaidSalary?.teacherId !== currentPaySalaries[0]?.teacherId) {
      let data = currentPaySalaries[0];
      for (let i = 0; i < currentPaySalaries.length; i++) {
        if (
          currentPaySalaries[i].isPaidSalary &&
          new Date(currentPaySalaries[i]?.datePaidSalary) >
            new Date(data?.datePaidSalary)
        )
          data = currentPaySalaries[i];
      }

      if (data?._id && data?.isPaidSalary)
        dispatch(actions.changeLatestPaidSalary({ data }));
      else {
        console.log('No data found!');
        dispatch(actions.changeLatestPaidSalary({ data: {} }));
      }
    }
  },

  resetCurrentPaySalary: () => (dispatch) => dispatch(actions.resetCurrentPaySalary()),
};

const initialState = {
  currentPaySalaries: [],
  latestPaySalaryTime: {},
  latestPaidSalary: {},
  allPaySalaries: [],
};

const paySalarySlice = createSlice({
  name: 'paySalaryReducer',
  initialState,
  reducers: {
    fetchPaySalaries: (state, action) => {
      state.allPaySalaries = action.payload.data;
    },

    createPaySalary: (state, action) => {
      state.allPaySalaries.push(action.payload.data);
      state.currentPaySalaries.push(action.payload.data);
      state.latestPaySalaryTime = action.payload.data;
      if (action.payload.data.isPaidSalary)
        state.latestPaidSalary = action.payload.data;
    },

    changeCurrentPaySalaries: (state, action) => {
      state.currentPaySalaries = [...action.payload.data];
    },

    changeLatestCurrentPaySalary: (state, action) => {
      state.latestPaySalaryTime = { ...action.payload.data };
    },

    changeLatestPaidSalary: (state, action) => {
      state.latestPaidSalary = { ...action.payload.data };
    },

    resetCurrentPaySalary: (state, action) => {
      state.currentPaySalaries = [];
      state.latestPaySalaryTime = {};
      state.latestPaidSalary = {};
    },
  },
});

const actions = paySalarySlice.actions;
export const { reducer } = paySalarySlice;
