import {
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
  CUSTOMER_CARD,
  FOLLOW_CUSTOMER,
  GET_ALL_CUSTOMER,
  SEARCH_CUSTOMER,
} from "../actionTypes";

const initialState = {
  customer: {},
  allCustomers: {},
  searchCustomers: {},
};

export default function (state = initialState, action) {
  console.log("customer profile reducer");
  console.log(action.type);
  console.log(action.payload);
  switch (action.type) {
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
    case GET_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
    case CUSTOMER_CARD:
      return {
        ...state,
        customer: action.payload,
      };
    case FOLLOW_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
    case GET_ALL_CUSTOMER:
      return {
        ...state,
        customer: null,
        allCustomers: action.payload,
        searchCustomers: null,
      };
    case SEARCH_CUSTOMER:
      return {
        ...state,
        customer: null,
        allCustomers: null,
        searchCustomers: action.payload,
      };
    default:
      return state;
  }
}
