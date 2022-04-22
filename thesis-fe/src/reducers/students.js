import produce from 'immer';

import * as actionTypes from '../constants/actionTypes';

const initState = {
  students: [],
  totalStudents: 0,
};

const studentsReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_STUDENTS:
        draft.students = action.payload;
        draft.totalStudents = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_STUDENT:
        draft.students.push(action.newStudent);
        break;
      case actionTypes.UPDATE_STUDENT:
        draft.students.map((student) => {
          if (student.id === action.id) student = action.student;
        });
        break;
      case actionTypes.DELETE_STUDENT:
        draft.students = draft.students.filter(
          (student) => student._id !== action.payload
        );
        --draft.totalStudents;
        break;
      default:
        return draft;
    }
  });

export default studentsReducer;
