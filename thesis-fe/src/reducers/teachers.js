import produce from 'immer';

import * as actionTypes from '../constants/actionTypes';

const initState = {
  teachers: [],
  totalTeachers: 0,
};

const teachersReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_TEACHERS:
        draft.teachers = action.payload;
        draft.totalTeachers = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_TEACHER:
        draft.teachers.push(action.newTeacher);
        break;
      case actionTypes.UPDATE_TEACHER:
        draft.teachers.map((teacher) => {
          if (teacher.id === action.id) teacher = action.teacher;
        });
        break;
      case actionTypes.DELETE_TEACHER:
        draft.teachers = draft.teachers.filter(
          (teacher) => teacher._id !== action.payload
        );
        --draft.totalTeachers;
        break;
      default:
        return draft;
    }
  });

export default teachersReducer;
