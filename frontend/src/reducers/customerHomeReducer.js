import { GET_CUSTOMER_HOME, SEARCH_RESTAURANTS } from "../actionTypes";

const initialState = {
  customer: {},
  restaurant: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMER_HOME:
      return {
        ...state,
        customer: action.payload,
        restaurant: null,
      };
    case SEARCH_RESTAURANTS:
      return {
        ...state,
        restaurant: action.payload,
        customer: null,
      };
    default:
      return state;
  }
}
