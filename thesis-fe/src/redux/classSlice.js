/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { changeStringToNormalizeString } from '../components/Common/utilities';

export const classActions = {
  getClasses: () => async (dispatch) => {
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
  searchClass :(str)=>(dispatch)=>{
    if(!str) dispatch(classActions.getClasses());

    dispatch(actions.searchClass({str:str ||'', dispatch}))
  },

  createClass: (clasS) => async (dispatch) => {
    try {
      const { data } = await api.createClass(clasS);

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
      const { data } = await api.updateClass(id, clasS);

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
      state.classes = state.classes.filter((clasS) => clasS._id !== action.payload.id);
      --state.totalClasses;
    },
    searchClass: (state, action) => {
      if (action.payload.str) {
        const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
        state.classes = state.classes.filter(
          (clasS) =>
            clasS.classId.includes(str) ||
            changeStringToNormalizeString(clasS.name).toLowerCase().includes(str)
        );
      }
      state.totalClasses = state.classes.length;
    },
  },
});

const actions = classSlice.actions;
export const { reducer } = classSlice;
