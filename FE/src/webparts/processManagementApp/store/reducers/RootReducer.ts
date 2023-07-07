// reducers.ts

import { combineReducers } from 'redux';
import { employeeReducer } from './EmployeeReducer';
import { leaveReducer } from './LeaveReducer';



const RootReducer = combineReducers({
  employees: employeeReducer,
  leaves: leaveReducer
});

export type RootState = ReturnType<typeof RootReducer>;

export default RootReducer;

