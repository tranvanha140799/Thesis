import produce from "immer";

import * as actionTypes from "../constants/actionTypes";

const initState = {
  classes: [],
  totalClasses: 0,
};

const classesReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_CLASS:
        draft.classes = action.payload;
        draft.totalClasses = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_TEACHER:
        draft.classes.push(action.newTeacher);
        break;
      case actionTypes.UPDATE_TEACHER:
        draft.classes.map((clasS) => {
          if (clasS.id === clasS.id) clasS = action.clasS;
        });
        break;
      case actionTypes.DELETE_TEACHER:
        draft.classes = draft.teachers.filter(
          (clasS) => clasS._id !== action.payload
        );
        --draft.totalClasses;
        break;
      default:
        return draft;
    }
  });

export default classesReducer;
