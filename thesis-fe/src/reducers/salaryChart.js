import produce from 'immer';

import * as actionTypes from '../constants/actionTypes';

const initState = {
  // {
  // salaryRankId: '', // Mã mức lương
  // basicSalary: 0, // Lương cơ bản
  // allowance: 0, // Phụ cấp
  // coefficient: 0, // Hệ số
  // },
  salaries: [],
  totalSalaries: 0,
};

const salaryChartReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.FETCH_SALARIES:
        draft.salaries = action.payload;
        draft.totalSalaries = Object.keys(action.payload)?.length;
        break;
      case actionTypes.CREATE_SALARY:
        draft.salaries.push(action.newSalary);
        break;
      case actionTypes.UPDATE_SALARY:
        draft.salaries.map((salary) => {
          if (salary.id === action.id) salary = action.salary;
        });
        break;
      case actionTypes.DELETE_SALARY:
        draft.salaries = draft.salaries.filter(
          (salary) => salary._id !== action.payload
        );
        --draft.totalSalaries;
        break;
      default:
        return draft;
    }
  });

export default salaryChartReducer;
