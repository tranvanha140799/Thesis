/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit';
import Meta from 'antd/lib/card/Meta';
import * as api from '../api';

import { changeStringToNormalizeString } from '../components/Common/utilities';

export const exemptActions = {
  getExempts: () => async (dispatch) => {
    try {
      const { data } = await api.getExempts();

      dispatch(actions.fetchExempts({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  searchExempt: (str) => (dispatch) => {
    if (!str) dispatch(exemptActions.getExempts());

    dispatch(actions.searchExempt({ str: str || '', dispatch }));
  },

  createExempt: (exempt, meta) => async (dispatch) => {
    try {
      const response = await api.createExempt(exempt);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.createExempt({ newExempt: response.data }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },

  updateExempt: (id, exempt, meta) => async (dispatch) => {
    try {
      const response = await api.updateExempt(id, exempt);
      if (response.status === 200 || response.status === 201) {
        dispatch(
          actions.updateExempt({
            id,
            exempt: response.data,
          })
        );
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },

  deleteExempt: (id, meta) => async (dispatch) => {
    try {
      const response = await api.deleteExempt(id);

      if (response.status === 200 || response.status === 201) {
        dispatch(actions.deleteExempt({ id }));
        if (meta.onSuccess) meta.onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (meta.onError) meta.onError(error);
    }
  },
};

const initialState = {
  exempts: [],
  totalExempts: 0,
};

const exemptSlice = createSlice({
  name: 'exemptReducer',
  initialState,
  reducers: {
    fetchExempts: (state, action) => {
      state.exempts = action.payload.data;
      state.totalExempts = Object.keys(action.payload.data)?.length;
    },
    createExempt: (state, action) => {
      state.exempts.push(action.payload.newExempt);
    },
    updateExempt: (state, action) => {
      state.exempts = state.exempts.map((exempt) =>
        exempt._id === action.payload.id ? (exempt = action.payload.exempt) : exempt
      );
    },
    deleteExempt: (state, action) => {
      state.exempts = state.exempts.filter(
        (exempt) => exempt._id !== action.payload.id
      );
      --state.totalExempts;
    },
    searchExempt: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.exempts = state.exempts.filter(
          (exempt) =>
            exempt.id.includes(str) ||
            changeStringToNormalizeString(exempt.name).toLowerCase().includes(str)
        );
      }
      state.totalExempts = state.exempts.length;
    },
  },
});

const actions = exemptSlice.actions;
export const { reducer } = exemptSlice;
