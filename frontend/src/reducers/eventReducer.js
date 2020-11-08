import {
  GET_EVENT_RESTAURANT,
  GET_ALL_EVENTS,
  GET_REGISTERED_EVENTS,
  SEARCH_EVENTS,
  ADD_EVENT,
} from "../actionTypes";

const initialState = {
  event: {},
  registered: {},
  filtered: {},
  result: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_EVENT_RESTAURANT:
      return {
        ...state,
        event: action.payload,
      };
    case SEARCH_EVENTS:
      return {
        ...state,
        filtered: action.payload,
        event: null,
        registered: null,
      };
    case GET_REGISTERED_EVENTS:
      return {
        ...state,
        registered: action.payload,
        filtered: null,
        event: null,
      };
    case GET_ALL_EVENTS:
      return {
        ...state,
        event: action.payload,
        registered: null,
        filtered: null,
      };
    case ADD_EVENT:
      return {
        ...state,
        result: action.payload,
      };
    default:
      return state;
  }
}
