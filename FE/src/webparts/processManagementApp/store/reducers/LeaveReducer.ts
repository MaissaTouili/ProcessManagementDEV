import { ADD_LEAVE_FAILURE, ADD_LEAVE_SUCCESS, DELETE_LEAVE_FAILURE, DELETE_LEAVE_SUCCESS, EDIT_LEAVE_FAILURE, EDIT_LEAVE_SUCCESS, GET_LIST_LEAVES_FAILURE, GET_LIST_LEAVES_SUCCESS } from '../actions/ActionTypes';

 export const leaveReducer = (
    state: Leave[] = [],
    action: { type: string; payload: Leave[] }
  ) : Leave[] => {
    switch (action.type) {
      case GET_LIST_LEAVES_SUCCESS:
        return action.payload;
      case GET_LIST_LEAVES_FAILURE:
        return []; // or handle failure scenario accordingly
      case DELETE_LEAVE_SUCCESS:
        // const deletedLeaves: Leave[] = action.payload ;
        // return state.filter((leave) => !deletedLeaves.some((deletedLeave) => deletedLeave.Id === leave.Id));
        return;
      case DELETE_LEAVE_FAILURE:
        return state;
      case ADD_LEAVE_SUCCESS:
        return [...state, ...action.payload];
      case ADD_LEAVE_FAILURE:
        return state;
        case EDIT_LEAVE_SUCCESS:
          if (Array.isArray(action.payload)) {
            const editedLeaves: Leave[] = action.payload;
            const updatedState = state.map((leave) => {
              let updatedLeave = leave;
              for (const editedLeave of editedLeaves) {
                if (editedLeave.Id === leave.Id) {
                  updatedLeave = { ...leave, ...editedLeave };
                  break;
                }
              }
              return updatedLeave;
            });
            return updatedState;
          }
          return state;
        case EDIT_LEAVE_FAILURE:
          return state;
      default:     
        return state;
    }
  };