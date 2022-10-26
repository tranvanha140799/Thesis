import * as api from "../api";
import * as actionTypes from "../constants/actionTypes";

// Action Creators
export const getClass = () => async (dispatch) => {
  try {
    const { data } = await api.getClasses();

    dispatch({ type: actionTypes.FETCH_CLASS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// export const getStudentsBySearch = (searchQuery) => async (dispatch) => {
//   try {
//     const {
//       data: { data },
//     } = await api.fetchStudentsBySearch(searchQuery);

//     dispatch({ type: actionTypes.FETCH_BY_SEARCH, payload: data });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const createClass = (clasS) => async (dispatch) => {
  try {
    const { data } = await api.createClasses(clasS);

    dispatch({
      type: actionTypes.CREATE_CLASS,
      payload: data,
      newClass: clasS,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateClass = (id, clasS) => async (dispatch) => {
  try {
    const { data } = await api.updateClasses(id, clasS);

    dispatch({
      type: actionTypes.UPDATE_CLASS,
      payload: data,
      id,
      class: clasS,
    });
  } catch (error) {
    console.log(error.messsage);
  }
};

export const deleteClass = (id) => async (dispatch) => {
  try {
    await api.deleteClass(id);

    dispatch({ type: actionTypes.DELETE_CLASS, payload: id });
  } catch (error) {
    console.log(error);
  }
};
