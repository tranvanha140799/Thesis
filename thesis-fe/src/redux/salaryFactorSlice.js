import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { changeStringToNormalizeString } from '../components/Common/utilities';

export const salaryFactorActions = {
  getSalaryFactors: () => async (dispatch) => {
    try {
      const { data } = await api.getSalaryFactors();

      dispatch(actions.fetchSalaryFactor({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  searchSalaryFactor: (str) => (dispatch) => {
    if (!str) dispatch(salaryFactorSlice.getSalaryFactors());

    dispatch(actions.searchSalaryFactor({ str: str || '', dispatch }));
  },

  createSalaryFactor: (salaryFactor, meta) => async (dispatch) => {
    try {
      const response = await api.createSalaryFactor(salaryFactor);
      if (response.status === 200 || response.status === 201) {
        dispatch(
          actions.createSalaryFactor({
            newSalaryFactor: response.data,
          })
        );
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },

  updateSalaryFactor: (id, salaryFactor, meta) => async (dispatch) => {
    try {
      const response = await api.updateSalaryFactor(id, salaryFactor);
      if (response.status === 200 || response.status === 201) {
        dispatch(
          actions.updateSalaryFactor({
            id,
            salaryFactor: response.data,
          })
        );
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },

  deleteSalaryFactor: (id, meta) => async (dispatch) => {
    try {
      const response = await api.deleteSalaryFactor(id);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.deleteSalaryFactor({ id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },
};

const initialState = {
  salaryFactors: [],
  totalSalaryFactors: 0,
};

const salaryFactorSlice = createSlice({
  name: 'salaryFactorReducer',
  initialState,
  reducers: {
    fetchSalaryFactor: (state, action) => {
      state.salaryFactors = action.payload.data;
      state.totalSalaryFactors = Object.keys(action.payload.data)?.length;
    },
    createSalaryFactor: (state, action) => {
      state.salaryFactors.push(action.payload.newSalaryFactor);
      ++state.totalSalaryFactors;
    },
    updateSalaryFactor: (state, action) => {
      state.salaryFactors = state.salaryFactors.map((salaryFactor) =>
        salaryFactor._id === action.payload.id
          ? (salaryFactor = action.payload.salaryFactor)
          : salaryFactor
      );
    },
    deleteSalaryFactor: (state, action) => {
      state.salaryFactors = state.salaryFactors.filter(
        (salaryFactor) => salaryFactor._id !== action.payload.id
      );
      --state.totalSalaryFactors;
    },
    searchSalaryFactor: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.salaryFactors = state.salaryFactors.filter(
          (salaryFactor) =>
            salaryFactor?.SalaryFactorId?.includes(str) ||
            changeStringToNormalizeString(salaryFactor.name)
              .toLowerCase()
              .includes(str)
        );
      }
      state.totalSalaryFactors = state.salaryFactors.length;
    },
  },
});

const actions = salaryFactorSlice.actions;
export const { reducer } = salaryFactorSlice;
