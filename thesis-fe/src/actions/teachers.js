import * as api from '../api';
import * as actionTypes from '../constants/actionTypes';

// Action Creators
export const getTeachers = () => async (dispatch) => {
  try {
    const { data } = await api.getTeachers();

    dispatch({ type: actionTypes.FETCH_TEACHERS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// export const getTeachersBySearch = (searchQuery) => async (dispatch) => {
//   try {
//     const {
//       data: { data },
//     } = await api.fetchTeachersBySearch(searchQuery);

//     dispatch({ type: actionTypes.FETCH_BY_SEARCH, payload: data });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const createTeacher = (teacher) => async (dispatch) => {
  try {
    const { data } = await api.createTeacher(teacher);

    dispatch({ type: actionTypes.CREATE_TEACHER, payload: data, newTeacher: teacher });
  } catch (error) {
    console.log(error);
  }
};

export const updateTeacher = (id, teacher) => async (dispatch) => {
  try {
    const { data } = await api.updateTeacher(id, teacher);

    dispatch({ type: actionTypes.UPDATE_TEACHER, payload: data, id, teacher });
  } catch (error) {
    console.log(error.messsage);
  }
};

export const deleteTeacher = (id) => async (dispatch) => {
  try {
    await api.deleteTeacher(id);

    dispatch({ type: actionTypes.DELETE_TEACHER, payload: id });
  } catch (error) {
    console.log(error);
  }
};

// export const likePost = (id) => async (dispatch) => {
//   try {
//     const { data } = await api.likePost(id);

//     dispatch({ type: actionTypes.LIKE, payload: data });
//   } catch (error) {
//     console.log(error);
//   }
// };
