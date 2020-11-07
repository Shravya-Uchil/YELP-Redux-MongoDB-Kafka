import {
  GET_RESTAURANT_HOME,
  GET_MENU_CATEGORY,
  GET_MENU_ITEM,
} from "../actionTypes";

const initialState = {
  restaurant: {},
  menu_category: {},
  menu_item: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RESTAURANT_HOME:
      return {
        ...state,
        restaurant: action.payload,
        menu_category: null,
        menu_item: null,
      };
    case GET_MENU_CATEGORY:
      return {
        ...state,
        restaurant: null,
        menu_category: action.payload,
        menu_item: null,
      };
    case GET_MENU_ITEM:
      return {
        ...state,
        restaurant: null,
        menu_category: null,
        menu_item: action.payload,
      };
    default:
      return state;
  }
}
