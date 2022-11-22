import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";
import { changeStringToNormalizeString } from "../components/Common/utilities";

export const SalaryFactorAction = {
    getSalaryFactor: () => async (dispatch) => {
        try {
          const { data } = await api.getSalaryFactor();
    
          dispatch(actions.fetchSalaryFactor({ data }));
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
      searchSalaryFactor: (str) => (dispatch) => {
        if (!str) dispatch(salaryFactorSlice.getSalaryFactor());
    
        dispatch(actions.searchSalaryFactor({ str: str || '', dispatch }));
      },
    
      createSalaryFactor: (salaryFactor) => async (dispatch) => {
        try {
          const { data } = await api.createSalaryFactor(salaryFactor);
    
          dispatch(
            actions.createSalaryFactor({
              newSalaryFactor: data,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    
      updateSalaryFactor: (id, salaryFactor) => async (dispatch) => {
        try {
          const { data } = await api.updateSalaryFactor(id, salaryFactor);
    
          dispatch(
            actions.updateSalaryFactor({
              id,
              salaryFactor: data,
            })
          );
        } catch (error) {
          console.log(error.messsage);
        }
      },
    
      deleteSalaryFactor: (id) => async (dispatch) => {
        try {
          await api.deleteSalaryFactor(id);
    
          dispatch(actions.deleteSalaryFactor({ id }));
        } catch (error) {
          console.log(error);
        }
      },
};


const initialState = {
  salaryFactors: [],
  totalSalaryFactors: 0,
};


const salaryFactorSlice = createSlice({
    name : 'salaryFactorReducer',
    initialState,
    reducers:{
        fetchSalaryFactor: (state, action) => {
            state.salaryFactor = action.payload.data;
            state.totalSalaryFactors = Object.keys(action.payload.data)?.length;
          },
          createSalaryFactor: (state, action) => {
            state.salaryFactor.push(action.payload.newClass);
          },
          updateSalaryFactor: (state, action) => {
            state.salaryFactor = state.salaryFactor.map((salaryfactor) =>
              salaryfactor._id === action.payload.salaryFactorId ? (salaryfactor = action.payload.salaryFactor) : salaryfactor
            );
          },
          deleteSalaryFactor: (state, action) => {
            state.salaryFactor = state.salaryFactor.filter((salaryfactor) => salaryfactor._id !== action.payload.salaryFactorId);
            --state.totalSalaryFactors;
          },
          searchClass: (state, action) => {
            if (action.payload.str) {
              const str = changeStringToNormalizeString(action.payload.str).toLowerCase();
              state.salaryFactor = state.salaryFactor.filter(
                (salaryfactor) =>
                  salaryfactor.classId.includes(str) ||
                  changeStringToNormalizeString(salaryfactor.name).toLowerCase().includes(str)
              );
            }
            state.totalSalaryFactors = state.salaryFactor.length;
          },
    }
});

const actions=salaryFactorSlice.actions;
export const {reducer} = salaryFactorSlice