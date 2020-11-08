import axios from "axios";
import {
  GET_EVENT_RESTAURANT,
  GET_ALL_EVENTS,
  GET_REGISTERED_EVENTS,
  SEARCH_EVENTS,
  ADD_EVENT,
} from "../actionTypes";
import serverAddress from "../config";

export const getEventForRestaurantById = (restaurant_id) => (dispatch) => {
  console.log("get restaurant for homepage");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/event/restaurant/${restaurant_id}`)
    .then((response) => response.data)
    .then((event) =>
      dispatch({
        type: GET_EVENT_RESTAURANT,
        payload: event,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const searchEvents = (searchInput) => (dispatch) => {
  console.log("search events");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/event/${searchInput}`)
    .then((response) => response.data)
    .then((event) =>
      dispatch({
        type: SEARCH_EVENTS,
        payload: event,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getRegisteredEvents = (customer_id) => (dispatch) => {
  console.log("get registered events ");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/event/customer/registration/${customer_id}`)
    .then((response) => response.data)
    .then((event) =>
      dispatch({
        type: GET_REGISTERED_EVENTS,
        payload: event,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getAllEvents = (restaurant_id) => (dispatch) => {
  console.log("get all events");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/event/all`)
    .then((response) => response.data)
    .then((event) =>
      dispatch({
        type: GET_ALL_EVENTS,
        payload: event,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const addEvent = (data) => (dispatch) => {
  console.log("add event");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/event/event`, data)
    .then((response) => response.data)
    .then((event) =>
      dispatch({
        type: ADD_EVENT,
        payload: event,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
