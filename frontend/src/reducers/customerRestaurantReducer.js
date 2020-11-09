import {
  HAS_REVIEWED,
  PLACE_ORDER,
  ADD_REVIEW,
  GET_MENU_CATEGORY_CUST,
  GET_MENU_ITEM_CUST,
} from "../actionTypes";

const initialState = {
  result: {},
  menu_category: {},
  menu_item: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case HAS_REVIEWED:
      return {
        ...state,
        result: action.payload,
        menu_category: null,
        menu_item: null,
      };
    case PLACE_ORDER:
      return {
        ...state,
        result: action.payload,
        menu_category: null,
        menu_item: null,
      };
    case ADD_REVIEW:
      return {
        ...state,
        result: action.payload,
        menu_category: null,
        menu_item: null,
      };
    case GET_MENU_CATEGORY_CUST:
      return {
        ...state,
        result: null,
        menu_category: action.payload,
        menu_item: null,
      };
    case GET_MENU_ITEM_CUST:
      return {
        ...state,
        result: null,
        menu_category: null,
        menu_item: action.payload,
      };
    default:
      return state;
  }
}
