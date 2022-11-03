import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';

export const classActions = {
  getClass: () => async (dispatch) => {
    try {
      const { data } = await api.getClasses();

      dispatch(actions.fetchClass({ data }));
    } catch (error) {
      console.log(error);
    }
  },

  // getClassesBySearch: (searchQuery) => async (dispatch) => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await api.fetchClassesBySearch(searchQuery);

  //     dispatch({ type: actionTypes.FETCH_BY_SEARCH, payload: data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  createClass: (clasS) => async (dispatch) => {
    try {
      const { data } = await api.createClasses(clasS);

      dispatch(
        actions.createClass({
          newClass: clasS,
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  updateClass: (id, clasS) => async (dispatch) => {
    try {
      const { data } = await api.updateClasses(id, clasS);

      dispatch(
        actions.updateClass({
          id,
          class: clasS,
        })
      );
    } catch (error) {
      console.log(error.messsage);
    }
  },

  deleteClass: (id) => async (dispatch) => {
    try {
      await api.deleteClass(id);

      dispatch(actions.deleteClass({ id }));
    } catch (error) {
      console.log(error);
    }
  },
};

const initialState = {
  classes: [],
  totalClasses: 0,
};

const classSlice = createSlice({
  name: 'classReducer',
  initialState,
  reducers: {
    fetchClass: (state, action) => {
      state.classes = action.payload.data;
      state.totalClasses = Object.keys(action.payload.data)?.length;
    },
    createClass: (state, action) => {
      state.classes.push(action.payload.newClass);
    },
    updateClass: (state, action) => {
      state.classes = state.classes.map((clasS) => {
        if (clasS.id === action.payload.clasS.id) clasS = action.clasS;
      });
    },
    deleteClass: (state, action) => {
      state.classes = state.teachers.filter(
        (clasS) => clasS._id !== action.payload.id
      );
      --state.totalClasses;
    },
  },
});

const actions = classSlice.actions;
export const { reducer } = classSlice;
