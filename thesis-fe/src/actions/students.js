import * as api from '../api';
import * as actionTypes from '../constants/actionTypes';

// Action Creators
export const getStudents = () => async (dispatch) => {
  try {
    const { data } = await api.getStudents();

    dispatch({ type: actionTypes.FETCH_STUDENTS, payload: data });
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

export const createStudent = (student) => async (dispatch) => {
  try {
    const { data } = await api.createStudent(student);

    dispatch({ type: actionTypes.CREATE_STUDENT, payload: data, newStudent: student });
  } catch (error) {
    console.log(error);
  }
};

export const updateStudent = (id, student) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(id, student);

    dispatch({ type: actionTypes.UPDATE_STUDENT, payload: data, id, student });
  } catch (error) {
    console.log(error.messsage);
  }
};

export const deleteStudent = (id) => async (dispatch) => {
  try {
    await api.deleteStudent(id);

    dispatch({ type: actionTypes.DELETE_STUDENT, payload: id });
  } catch (error) {
    console.log(error);
  }
};
