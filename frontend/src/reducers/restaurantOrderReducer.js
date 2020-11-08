import {
  GET_ORDERS,
  UPDATE_ORDER_STATUS,
  UPDATE_DELIVERY_STATUS,
} from "../actionTypes";

const initialState = {
  orders: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: action.payload,
      };
    case UPDATE_DELIVERY_STATUS:
      return {
        ...state,
        orders: action.payload,
      };
    default:
      return state;
  }
}
