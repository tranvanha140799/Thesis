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
      case actionTypes.CREATE_CLASS:
        draft.classes.push(action.newClass);
        break;
      case actionTypes.UPDATE_CLASS:
        draft.classes.map((clasS) => {
          if (clasS.id === clasS.id) clasS = action.clasS;
        });
        break;
      case actionTypes.DELETE_CLASS:
        draft.classes = draft.classes.filter(
          (clasS) => clasS._id !== action.payload
        );
        --draft.totalClasses;
        break;
      default:
        return draft;
    }
  });

export default classesReducer;
