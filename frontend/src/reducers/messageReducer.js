import {
  GET_ALL_MESSAGES_RESTAURANT,
  GET_ALL_MESSAGES_CUSTOMER,
  GET_MESSAGE_DETAILS,
  SEND_MESSAGE,
} from "../actionTypes";

const initialState = {
  message: {},
};

export default function (state = initialState, action) {
  console.log("message reducer");
  console.log(action);
  switch (action.type) {
    case GET_ALL_MESSAGES_RESTAURANT:
      return {
        ...state,
        message: action.payload,
      };
    case GET_ALL_MESSAGES_CUSTOMER:
      return {
        ...state,
        message: action.payload,
      };
    case GET_MESSAGE_DETAILS:
      return {
        ...state,
        message: action.payload,
      };
    case SEND_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}
