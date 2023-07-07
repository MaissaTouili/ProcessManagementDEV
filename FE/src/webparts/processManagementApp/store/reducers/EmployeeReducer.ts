import { GET_LIST_EMPLOYEES_SUCCESS, GET_LIST_EMPLOYEES_FAILURE, DELETE_EMPLOYEE_SUCCESS, DELETE_EMPLOYEE_FAILURE, ADD_EMPLOYEE_FAILURE, ADD_EMPLOYEE_SUCCESS, EDIT_EMPLOYEE_SUCCESS, EDIT_EMPLOYEE_FAILURE } from '../actions/ActionTypes';

 export const employeeReducer = (
    state: Employee[] = [],
    action: { type: string; payload: Employee[] }
  ): Employee[] => {
    switch (action.type) {
      case GET_LIST_EMPLOYEES_SUCCESS:
        return action.payload;
      case GET_LIST_EMPLOYEES_FAILURE:
        return []; // or handle failure scenario accordingly
      case DELETE_EMPLOYEE_SUCCESS:
        {
        const deletedEmployees: Employee[] = action.payload ;
        return state.filter((employee) => !deletedEmployees.some((deletedEmployee) => deletedEmployee.Id === employee.Id));
        }
      case DELETE_EMPLOYEE_FAILURE:
        return state;
      case ADD_EMPLOYEE_SUCCESS:
        return [...state, ...action.payload];
      case ADD_EMPLOYEE_FAILURE:
        return state;
      case EDIT_EMPLOYEE_SUCCESS:
        if (Array.isArray(action.payload)) {
          const editedEmployees: Employee[] = action.payload;
          const updatedState = state.map((employee) => {
            let updatedEmployee = employee;
            for (const editedEmployee of editedEmployees) {
              if (editedEmployee.Id === employee.Id) {
                updatedEmployee = { ...employee, ...editedEmployee };
                break;
              }
            }
            return updatedEmployee;
          });
          return updatedState;
        }
        return state;
      case EDIT_EMPLOYEE_FAILURE:
        return state;
      default:     
        return state;
    }
  };