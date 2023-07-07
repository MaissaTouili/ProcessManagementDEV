// actions.ts
import { GET_LIST_EMPLOYEES_REQUEST,GET_LIST_EMPLOYEES_SUCCESS, GET_LIST_EMPLOYEES_FAILURE,DELETE_EMPLOYEE_SUCCESS,DELETE_EMPLOYEE_FAILURE, EDIT_EMPLOYEE_FAILURE, ADD_EMPLOYEE_FAILURE, ADD_EMPLOYEE_REQUEST, ADD_EMPLOYEE_SUCCESS, EDIT_EMPLOYEE_REQUEST, EDIT_EMPLOYEE_SUCCESS,
   ADD_LEAVE_FAILURE, ADD_LEAVE_REQUEST, ADD_LEAVE_SUCCESS, DELETE_LEAVE_FAILURE, DELETE_LEAVE_SUCCESS, GET_LIST_LEAVES_FAILURE, GET_LIST_LEAVES_REQUEST, GET_LIST_LEAVES_SUCCESS, EDIT_LEAVE_REQUEST, EDIT_LEAVE_SUCCESS, EDIT_LEAVE_FAILURE } from './ActionTypes';

export const getEmployeesRequest = (): { type: string } => ({
  type: GET_LIST_EMPLOYEES_REQUEST,
});

export const getEmployeesSuccess = (items: Employee[]): { type: string; payload: Employee[] } => ({
  type: GET_LIST_EMPLOYEES_SUCCESS,
  payload: items,
});

export const getEmployeesFailure = (error: string): { type: string; payload: string } => ({
  type: GET_LIST_EMPLOYEES_FAILURE,
  payload: error,
});

export const deleteEmployeeSuccess = (itemId: string): { type: string; payload: string } => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: itemId,
});

export const deleteEmployeeFailure = (error: string): { type: string; payload: string } => ({
  type: DELETE_EMPLOYEE_FAILURE,
  payload: error,
});

export const addEmployeeRequest = (): { type: string } => ({
  type: ADD_EMPLOYEE_REQUEST,
});

export const addEmployeeSuccess = (): { type: string } => ({
  type: ADD_EMPLOYEE_SUCCESS,
});

export const addEmployeeFailure = (error: string): { type: string; payload: string } => ({
  type: ADD_EMPLOYEE_FAILURE,
  payload: error,
});

export const editEmployeeRequest = (): { type: string } => ({
  type: EDIT_EMPLOYEE_REQUEST,
});

export const editEmployeeSuccess = (): { type: string } => ({
  type: EDIT_EMPLOYEE_SUCCESS,
});

export const editEmployeeFailure = (error: string): { type: string; payload: string } => ({
  type: EDIT_EMPLOYEE_FAILURE,
  payload: error,
});

export const getLeavesRequest = (): { type: string } => ({
  type: GET_LIST_LEAVES_REQUEST,
});

export const getLeavesSuccess = (items: Leave[]): { type: string; payload: Leave[] }  => ({
  type: GET_LIST_LEAVES_SUCCESS,
  payload: items,
});

export const getLeavesFailure = (error: string): { type: string; payload: string } => ({
  type: GET_LIST_LEAVES_FAILURE,
  payload: error,
});

export const deleteLeaveSuccess = (itemId: string): { type: string; payload: string } => ({
  type: DELETE_LEAVE_SUCCESS,
  payload: itemId,
});

export const deleteLeaveFailure = (error: string): { type: string; payload: string } => ({
  type: DELETE_LEAVE_FAILURE,
  payload: error,
});

export const addLeaveRequest = (): { type: string } => ({
  type: ADD_LEAVE_REQUEST,
});

export const addLeaveSuccess = (): { type: string } => ({
  type: ADD_LEAVE_SUCCESS,
});

export const addLeaveFailure = (error: string): { type: string; payload: string } => ({
  type: ADD_LEAVE_FAILURE,
  payload: error,
});

export const editLeaveRequest = (): { type: string } => ({
  type: EDIT_LEAVE_REQUEST,
});

export const editLeaveSuccess = (): { type: string } => ({
  type: EDIT_LEAVE_SUCCESS,
});

export const editLeaveFailure = (error: string): { type: string; payload: string } => ({
  type: EDIT_LEAVE_FAILURE,
  payload: error,
});
